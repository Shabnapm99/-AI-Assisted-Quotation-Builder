import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { axiosInstance } from '../axios/axiosInstance';
import { setCurrentQuote, addQuoteToList, updateQuoteInList, resetQuoteForm } from '../features/quotationSlice';
import { MdAdd, MdExpandMore, MdOutlineSaveAs, MdOutlineSend } from 'react-icons/md';
import { RiPsychotherapyLine } from "react-icons/ri";
import { HiOutlineBolt } from "react-icons/hi2";
import QuoteItemsTable from '../components/QuoteItemsTable';


function NewQuotation() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const clients = useSelector(state => state.client.clients);
  const isEditing = useSelector(state => state.quote.isEditing);
  const id = useSelector(state => state.quote.uniqueId);

  const [editingItemId, setEditingItemId] = useState(null);//To know whick quoteItem id editing
  const [loading, setLoading] = useState(false)
  const [aiDraftLoading, setAiDraftLoading] = useState(false);
  const [requirement, setRequirement] = useState('');
  const [summary, setSummary] = useState('');
  const [questions, setQuestions] = useState([]);
  const [items, setItems] = useState([]);
  const [deletedItems, setDeletedItems] = useState([]);

  // MAIN STATE
  const [formData, setFormData] = useState({
    title: '',
    client: '',
    status: 'draft'
  });

  const [newItem, setNewItem] = useState({
    title: '',
    description: '',
    quantity: '',
    unit_price: ''
  });

  // Prefill quote data (edit mode)
  useEffect(() => {
    if (!isEditing || !id) return;

    const fetchQuotation = async () => {
      try {
        const res = await axiosInstance.get(`/quotations/${id}`);

        const quote = res.data.quote;

        setFormData({
          title: quote.title,
          client: quote.client._id,
          status: quote.status
        });

        setItems(quote.items || []);
      } catch (err) {
        console.error(err);
        toast.error('Failed to load quotation');
      }
    };

    fetchQuotation();
  }, [isEditing, id]);

  // HANDLE FORM

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleItemChange = (e) => {
    const { name, value } = e.target;
    setNewItem(prev => ({ ...prev, [name]: value }));
  };

  //Handle edit Item

  const handleEditItem = (id) => {
    const itemToEdit = items.find((item) => item._id === id);
    if (!itemToEdit) return;
    console.log(itemToEdit)
    setNewItem({
      title: itemToEdit.title,
      description: itemToEdit.description,
      quantity: itemToEdit.quantity,
      unit_price: itemToEdit.unit_price
    });
    setEditingItemId(id);
  }

  // ADD ITEM LOCALLY

  const handleAddItem = () => {
    if (!newItem.title || !newItem.quantity || !newItem.unit_price || !newItem.description) return toast.error("Please provide all details");

    const quantity = Number(newItem.quantity);
    const unit_price = Number(newItem.unit_price || 0);

    // If items edit mode, replace the existing one with edited one when click submit
    if (editingItemId) {
      setItems(prev =>
        prev.map(item =>
          item._id === editingItemId
            ? {
              ...item,
              title: newItem.title,
              description: newItem.description,
              quantity,
              unit_price,
              total: quantity * unit_price
            }
            : item
        )
      );

      setEditingItemId(null);
    }
    else {
      const item = {
        _id: Date.now(),
        title: newItem.title,
        description: newItem.description,
        quantity,
        unit_price,
        total: quantity * unit_price,
        isNew: true
      };

      setItems(prev => [...prev, item]);

    }

    setNewItem({
      title: '',
      description: '',
      quantity: '',
      unit_price: ''
    });
  };

  // REMOVE ITEM

  const handleRemoveItem = (id) => {
    setItems(prev => prev.filter(i => i._id !== id));
    const isRealId = typeof id === 'string' && id.length === 24;
    if (isRealId) {
      setDeletedItems(prev => [...prev, id]);
    }
  };//to restrict the fakeId reaching to the DB


  // SUBTOTAL
  const subtotal = items.reduce((sum, item) => sum + (item.total || 0), 0);

  // SAVE as draft

  const handleSaveAsDraft = async () => {
    if (!formData.title || !formData.client) return toast.error("Please add required fields")
    try {
      setLoading(true);

      let quotationId = id;

      // CREATE MODE
      if (!isEditing) {
        const res = await axiosInstance.post('/quotations', formData);
        quotationId = res.data.quotation._id;
      }
      // EDIT MODE
      else {
        await axiosInstance.put(`/quotations/${id}`, formData);
      }

      // ITEMS - CREATE NEW
      const newItems = items.filter(i => i.isNew);

      await Promise.all(
        newItems.map(item => {
          const itemData = {
            title: item.title,
            description: item.description,
            quantity: item.quantity,
            unit_price: item.unit_price
          };
          return axiosInstance.post(`/quotations/${quotationId}/items`, itemData);
        })
      );

      // ITEMS - UPDATE EXISTING
      const existingItems = items.filter(i => !i.isNew);

      await Promise.all(
        existingItems.map(item => {
          const itemData = {
            title: item.title,
            description: item.description,
            quantity: item.quantity,
            unit_price: item.unit_price
          };
          return axiosInstance.put(`/quotations/${quotationId}/items/${item._id}`, itemData);
        })
      );

      // ITEMS - DELETE REMOVED
      await Promise.all(
        deletedItems.map(itemId =>
          axiosInstance.delete(`/quotations/${quotationId}/items/${itemId}`)
        )
      );

      // Fetch the updated populated quote to sync Redux store
      const finalQuoteRes = await axiosInstance.get(`/quotations/${quotationId}`);
      const savedQuote = finalQuoteRes?.data?.quote;
      if (savedQuote) {
        if (isEditing) {
          dispatch(updateQuoteInList(savedQuote));
        } else {
          dispatch(addQuoteToList(savedQuote));
        }
        dispatch(setCurrentQuote(savedQuote));
      }
      dispatch(resetQuoteForm());

      toast.success(isEditing ? 'Quotation updated' : 'Quotation created');
      navigate(`/dashboard/quotes/${quotationId}`);

    } catch (err) {
      console.error(err);
      toast.error(`Save failed due to: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Generate AI draft
  const generateAI = async () => {
    if (!requirement) return toast.error("Please type the requirement");
    try {
      setAiDraftLoading(true);
      let response = await axiosInstance.post('/ai/draft', { requirement });
      const suggested = response?.data?.suggested_items || [];
      
      setItems(
        suggested.map(item => {
          const qty = Number(item.quantity) || 1;
          const price = item.unit_price != null ? Number(item.unit_price) : 0;
          return {
            ...item,
            _id: Date.now() + Math.random(),
            isNew: true,
            quantity: qty,
            unit_price: price,
            total: qty * price
          };
        })
      );

      setFormData(prev => ({
        ...prev,
        title: response?.data?.project_type || prev.title
      }));
      setSummary(response?.data?.summary || '');
      setQuestions(response?.data?.questions_to_ask_client || []);
      setRequirement('');

    } catch (error) {
      console.error(error);
      toast.error('Failed to generate the draft');
    } finally {
      setAiDraftLoading(false);
    }
  };

  return (
    <main className="px-10 min-h-screen">
      <div className="max-w-full mx-auto">
        {/* Page Header*/}

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h2 className="font-medium text-[32px] tracking-tight text-on-background">
              {isEditing ? "Edit Quotation" : "Create New Quotation"}
            </h2>
            <p className="text-sm text-on-surface-variant mt-1 hidden sm:block">
              Set up your line items and pricing details for submission.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* Save as Draft Button */}
            <button
              onClick={handleSaveAsDraft}
              type="button"
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium border border-outline-variant text-on-surface rounded-lg hover:bg-surface-container-low focus-visible:ring-2 focus-visible:ring-primary outline-none active:scale-[0.98] transition-all cursor-pointer"
              disabled={loading}>
              <MdOutlineSaveAs className="text-lg text-on-surface-variant" />
              <span>{loading ? 'Saving' : "Save"}</span>
              <span className="hidden lg:inline">as Draft</span>
            </button>

            {/* Send to Client Button */}
            <button
              type="button"
              className="flex-1 hidden lg:flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium bg-primary text-on-primary rounded-lg hover:opacity-95 hover:shadow-sm focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 outline-none active:scale-[0.98] transition-all"
            >
              <MdOutlineSend className="text-lg" />
              <span>Send</span>
              <span className="hidden lg:inline">to Client</span>
            </button>
          </div>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-12 gap-6">
          {/*AI Input & Results */}
          <div className="col-span-12 lg:col-span-8 space-y-6">
            <section
              className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/20 p-4 overflow-hidden relative">

              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-10 h-10 bg-secondary-container rounded-lg flex items-center justify-center text-on-secondary-container">
                  <RiPsychotherapyLine />
                </div>
                <div>
                  <h3 className="text-[20px]">AI Draft Generator</h3>
                  <p className="text-[14px] text-on-surface-variant">Paste client requirements to
                    automatically build your quote.</p>
                </div>
              </div>

              <div className="relative group">
                <textarea
                  className="w-full bg-surface-container-low border-outline-variant/30 rounded-lg p-4 text-[16px] focus:ring-secondary focus:border-secondary transition-all"
                  id="ai-input"
                  name="requirement"
                  value={requirement}
                  placeholder="Example: Client needs a modern e-commerce website for a boutique fashion brand. Requires 8 pages, secure checkout, mobile responsiveness, and 3 months of priority support..."
                  onChange={(e) => setRequirement(e.target.value)}
                ></textarea>
                <div className="absolute bottom-4 right-4 flex gap-2">
                  <button
                    disabled={aiDraftLoading}
                    className="bg-secondary text-on-secondary px-6 py-2 rounded-lg flex items-center gap-2 hover:shadow-lg active:scale-95 transition-all cursor-pointer"
                    id="generate-btn" onClick={() => generateAI()}>
                    <HiOutlineBolt />
                    {aiDraftLoading ? "Thinking..." : "Generate Draft"}
                  </button>
                </div>
              </div>
            </section>

            {/* Quotation Items section */}

            <section
              className=" "
              id="quotation-items-section">
              <QuoteItemsTable quoteItems={items} handleDelete={handleRemoveItem} handleEdit={handleEditItem} />

              <div className="p-5  rounded-xl shadow-sm border border-outline-variant/20 overflow-hidden mt-6 bg-surface-container-lowest">
                <h4 className="text-[16px] font-medium text-on-background mb-4">Add Custom Item</h4>

                <div className="grid grid-cols-12 gap-4 items-end">
                  {/* Item Name */}
                  <div className="col-span-12 md:col-span-4">
                    <label className="block text-[12px] text-on-surface-variant mb-1">Item Title</label>
                    <input
                      type="text"
                      placeholder="e.g., UI/UX Design Setup"
                      name='title'
                      value={newItem.title}
                      className="w-full text-sm bg-surface-container-low border border-outline-variant/30 rounded-lg p-2.5 focus:ring-secondary focus:border-secondary transition-all"
                      onChange={handleItemChange} />
                  </div>

                  {/* Description */}
                  <div className="col-span-12 md:col-span-4">
                    <label className="block text-[12px] text-on-surface-variant mb-1">Description</label>
                    <input
                      type="text"
                      name='description'
                      value={newItem.description}
                      placeholder="e.g., Wireframing and high-fidelity mockups"
                      className="w-full text-sm bg-surface-container-low border border-outline-variant/30 rounded-lg p-2.5 focus:ring-secondary focus:border-secondary transition-all"
                      onChange={handleItemChange} />
                  </div>

                  {/* Quantity */}
                  <div className="col-span-6 md:col-span-11/12 lg:col-span-1">
                    <label className="block text-[12px] text-on-surface-variant mb-1">Qty</label>
                    <input
                      name='quantity'
                      value={newItem.quantity}
                      type="number"
                      min="1"
                      placeholder="1"
                      className="w-full text-sm bg-surface-container-low border border-outline-variant/30 rounded-lg p-2.5 focus:ring-secondary focus:border-secondary transition-all text-center"
                      onChange={handleItemChange} />
                  </div>

                  {/* Price */}
                  <div className="col-span-6 md:col-span-2">
                    <label className="block text-[12px] text-on-surface-variant mb-1">Price (BD)</label>
                    <input
                      type="number"
                      name='unit_price'
                      value={newItem.unit_price}
                      placeholder="0.00"
                      className="w-full text-sm bg-surface-container-low border border-outline-variant/30 rounded-lg p-2.5 focus:ring-secondary focus:border-secondary transition-all"
                      onChange={handleItemChange} />
                  </div>

                  {/* Add Action Button */}
                  <div className="col-span-12 md:col-span-1">
                    <button
                      type="button"
                      className="w-full bg-secondary-container text-on-secondary-container hover:bg-secondary hover:text-on-secondary transition-all p-2.5 rounded-lg flex items-center justify-center font-medium shadow-sm group cursor-pointer"
                      title="Add Item"
                      onClick={handleAddItem}>
                      <MdAdd className="text-xl group-hover:scale-110 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>

            </section>

          </div>

          {/* Quotation Details Sidebar */}
          <div className="col-span-12 lg:col-span-4 space-y-6">
            <section className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/20 p-5 sticky top-24">
              <h3 className="text-[20px] font-medium text-on-background mb-6">Quotation Details</h3>

              <div className="space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-[14px] font-medium text-on-surface-variant mb-2">
                    Quotation Title
                  </label>
                  <input
                    type="text"
                    name='title'
                    value={formData.title}
                    placeholder="e.g. Website Design - Spring 2026"
                    className="w-full bg-surface border border-outline-variant/50 rounded-lg p-3 text-[15px] focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-all outline-none"
                    onChange={handleChange} />
                </div>

                {/* Client Selection */}
                <div>
                  <label className="block text-[14px] font-medium text-on-surface-variant mb-2">
                    Select Client
                  </label>
                  <div className="relative">
                    <select className="w-full bg-surface border border-outline-variant/50 rounded-lg p-3 text-[15px] focus:ring-2 focus:ring-secondary/50 focus:border-secondary appearance-none transition-all outline-none text-on-surface"
                      name='client' value={formData.client} onChange={handleChange}>
                      <option value="">Select Client</option>
                      {clients?.map((client) => (
                        <option
                          key={client._id}
                          value={client._id}>
                          {client.company}
                        </option>
                      ))}
                    </select>
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant text-xl">
                      <MdExpandMore />
                    </span>
                  </div>
                </div>

                {/* Summary Divider */}
                <hr className="border-outline-variant/20 my-4" />

                {/* Financial Summary Preview */}
                <div className="bg-surface-container-low rounded-xl p-4 space-y-3">
                  <div className="flex justify-between text-[14px] text-on-surface-variant">
                    <span>Subtotal</span>
                    <span className="font-medium">{subtotal} BD</span>
                  </div>
                  <div className="flex justify-between text-[14px] text-on-surface-variant">
                    <span>Estimated Tax</span>
                    <span className="font-medium">0.00 BD</span>
                  </div>
                  <div className="border-t border-outline-variant/30 my-2 pt-2 flex justify-between text-[16px] text-on-surface font-semibold">
                    <span>Total Amount</span>
                    <span className="text-secondary">{subtotal} BD</span>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* Summary and questions to ask client from AI draft */}
      {summary && (
        <div className="space-y-6 bg-surface p-6 rounded-2xl border border-outline-variant/30 print:hidden">

          {/* Summary Section */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-on-surface flex items-center gap-2">
              AI Summary
            </h3>
            <p className="text-sm md:text-base text-on-surface-variant leading-relaxed">
              {summary}
            </p>
          </div>

          {/* Summary Divider */}
          <hr className="border-outline-variant/30" />

          {/* Questions Section */}
          {questions && questions.length > 0 && (
            <div className="bg-surface-container-low rounded-xl p-5 border border-outline-variant/20 space-y-4">
              <div>
                <h3 className="text-base font-semibold text-on-surface">
                  Questions to ask Client
                </h3>
                <p className="text-xs text-on-surface-variant">
                  Review these insights before your next client touchpoint.
                </p>
              </div>

              <ul className="space-y-3">
                {questions.map((ques, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-3 text-sm text-on-surface-variant bg-surface p-3 rounded-lg border border-outline-variant/10 shadow-sm transition-all hover:border-outline-variant/40"
                  >
                    {/* Clean bullet indicator or question number */}
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                      {index + 1}
                    </span>
                    <span className="pt-0.5 leading-tight">{ques}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

        </div>
      )}

    </main >
  )
}

export default NewQuotation;