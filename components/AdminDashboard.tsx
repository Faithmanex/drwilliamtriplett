import React, { useState, useEffect } from 'react';
import { Book, Review } from '../types';
import { Plus, Trash2, Edit2, Save, X, Upload, CheckCircle, AlertCircle, Lock, LayoutDashboard } from 'lucide-react';
import { useToast } from './Toast';

const AdminDashboard: React.FC = () => {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [books, setBooks] = useState<Book[]>([]);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();

  const [editForm, setEditForm] = useState<Partial<Book>>({
    title: '',
    subtitle: '',
    description: '',
    longDescription: '',
    price: 0,
    features: [],
    pubDate: new Date().getFullYear().toString()
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${password}`,
          'Content-Type': 'application/json'
        }
      });
      if (res.ok) {
        setIsAuthenticated(true);
        fetchBooks();
        showToast('Authenticated successfully', 'success');
      } else {
        showToast('Invalid password', 'error');
      }
    } catch (err) {
      showToast('Login failed', 'error');
    }
  };

  const fetchBooks = async () => {
    try {
      const res = await fetch('/api/admin/books');
      if (res.ok) {
        const data = await res.json();
        setBooks(data);
      }
    } catch (err) {
      showToast('Failed to fetch books', 'error');
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      let updatedBooks;
      if (isEditing === 'new') {
        const newBook = { ...editForm, id: editForm.title?.toLowerCase().replace(/\s+/g, '-') } as Book;
        updatedBooks = [...books, newBook];
      } else {
        updatedBooks = books.map(b => b.id === isEditing ? { ...b, ...editForm } as Book : b);
      }

      const res = await fetch('/api/admin/books', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${password}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedBooks)
      });

      if (res.ok) {
        setBooks(updatedBooks);
        setIsEditing(null);
        showToast('Books saved successfully', 'success');
      } else {
        showToast('Failed to save books', 'error');
      }
    } catch (err) {
      showToast('Error saving books', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'imageUrl' | 'blobUrl') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${password}`,
          'x-filename': file.name,
          'Content-Type': file.type
        },
        body: file
      });

      if (res.ok) {
        const { url } = await res.json();
        setEditForm(prev => ({ ...prev, [field]: url }));
        showToast(`${field === 'imageUrl' ? 'Image' : 'PDF'} uploaded successfully`, 'success');
      } else {
        showToast('Upload failed', 'error');
      }
    } catch (err) {
      showToast('Error uploading file', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const startEdit = (book: Book | null) => {
    if (book) {
      setEditForm(book);
      setIsEditing(book.id);
    } else {
      setEditForm({
        title: '',
        subtitle: '',
        description: '',
        longDescription: '',
        price: 0,
        features: [],
        pubDate: new Date().getFullYear().toString()
      });
      setIsEditing('new');
    }
  };

  const deleteBook = async (id: string) => {
    if (!confirm('Are you sure you want to delete this book?')) return;
    
    const updatedBooks = books.filter(b => b.id !== id);
    try {
      const res = await fetch('/api/admin/books', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${password}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedBooks)
      });

      if (res.ok) {
        setBooks(updatedBooks);
        showToast('Book deleted', 'success');
      }
    } catch (err) {
      showToast('Failed to delete book', 'error');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-brand-light flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl shadow-card p-10 w-full max-w-md reveal-on-scroll">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-brand-dark rounded-2xl flex items-center justify-center text-brand-accent mb-4">
              <Lock size={32} />
            </div>
            <h1 className="font-serif text-3xl font-bold text-brand-dark">Admin Access</h1>
            <p className="text-slate-500 text-sm mt-2">Enter credentials to manage resources</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-5 py-3 rounded-xl border border-slate-200 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 transition-all outline-none"
                placeholder="••••••••"
                required
              />
            </div>
            <button 
              type="submit"
              className="w-full bg-brand-dark text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg hover:shadow-brand-dark/20"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-light pt-28 pb-20 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6 reveal-on-scroll">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <LayoutDashboard className="text-brand-accent" size={24} />
              <h1 className="font-serif text-4xl font-bold text-brand-dark">Admin Dashboard</h1>
            </div>
            <p className="text-slate-500 font-light">Manage your books, publications, and digital resources.</p>
          </div>
          <button 
            onClick={() => startEdit(null)}
            className="inline-flex items-center gap-2 bg-brand-primary text-white px-6 py-3 rounded-full font-bold hover:bg-brand-dark transition-all shadow-md"
          >
            <Plus size={20} /> Add New Book
          </button>
        </div>

        {/* Books List */}
        <div className="grid grid-cols-1 gap-6 reveal-on-scroll delay-100">
          {books.map((book) => (
            <div key={book.id} className="bg-white rounded-2xl p-6 shadow-soft border border-slate-100 flex items-center gap-6 group hover:border-brand-primary/20 transition-all">
              <div className="w-20 h-28 rounded-lg bg-slate-100 overflow-hidden flex-shrink-0">
                {book.imageUrl && <img src={book.imageUrl} alt={book.title} className="w-full h-full object-cover" />}
              </div>
              <div className="flex-grow">
                <h3 className="font-serif text-xl font-bold text-brand-dark">{book.title}</h3>
                <p className="text-slate-500 text-sm italic">{book.subtitle}</p>
                <div className="flex items-center gap-4 mt-2">
                  <span className="text-brand-accent font-bold">${book.price}</span>
                  <span className="text-slate-400 text-xs uppercase tracking-widest">{book.pubDate}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => startEdit(book)}
                  className="p-3 rounded-xl bg-slate-50 text-slate-400 hover:bg-brand-light hover:text-brand-primary transition-all"
                  title="Edit Book"
                >
                  <Edit2 size={18} />
                </button>
                <button 
                  onClick={() => deleteBook(book.id)}
                  className="p-3 rounded-xl bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all"
                  title="Delete Book"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}

          {books.length === 0 && (
            <div className="bg-white rounded-2xl p-20 text-center border-2 border-dashed border-slate-200">
              <div className="text-slate-300 mb-4 flex justify-center"><AlertCircle size={48} /></div>
              <h3 className="text-xl font-serif font-bold text-slate-400">No Books Found</h3>
              <p className="text-slate-400 mt-2">Click "Add New Book" to get started.</p>
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 backdrop-blur-sm bg-brand-dark/20">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col scale-in">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <h2 className="font-serif text-2xl font-bold text-brand-dark">
                {isEditing === 'new' ? 'Add New Book' : 'Edit Book Details'}
              </h2>
              <button 
                onClick={() => setIsEditing(null)}
                className="p-2 hover:bg-slate-100 rounded-full transition-all"
                aria-label="Close modal"
              >
                <X size={24} className="text-slate-400" />
              </button>
            </div>

            <div className="p-8 space-y-8">
              {/* Form Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Book Title</label>
                  <input 
                    type="text" 
                    value={editForm.title}
                    onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-5 py-3 rounded-xl border border-slate-200 focus:border-brand-primary outline-none"
                    placeholder="Enter book title"
                    aria-label="Book Title"
                  />
                </div>
                <div className="space-y-4">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Subtitle</label>
                  <input 
                    type="text" 
                    value={editForm.subtitle}
                    onChange={(e) => setEditForm(prev => ({ ...prev, subtitle: e.target.value }))}
                    className="w-full px-5 py-3 rounded-xl border border-slate-200 focus:border-brand-primary outline-none"
                    placeholder="Enter subtitle"
                    aria-label="Subtitle"
                  />
                </div>
                <div className="space-y-4">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Price ($)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    value={editForm.price}
                    onChange={(e) => setEditForm(prev => ({ ...prev, price: parseFloat(e.target.value) }))}
                    className="w-full px-5 py-3 rounded-xl border border-slate-200 focus:border-brand-primary outline-none"
                    placeholder="0.00"
                    aria-label="Price"
                  />
                </div>
                <div className="space-y-4">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Publication Date</label>
                  <input 
                    type="text" 
                    value={editForm.pubDate}
                    onChange={(e) => setEditForm(prev => ({ ...prev, pubDate: e.target.value }))}
                    className="w-full px-5 py-3 rounded-xl border border-slate-200 focus:border-brand-primary outline-none"
                    placeholder="e.g. 2024"
                    aria-label="Publication Date"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Short Description</label>
                <textarea 
                  value={editForm.description}
                  onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full px-5 py-3 rounded-xl border border-slate-200 focus:border-brand-primary outline-none resize-none"
                  placeholder="Brief summary for catalog cards"
                  aria-label="Short Description"
                />
              </div>

              <div className="space-y-4">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Long Description</label>
                <textarea 
                  value={editForm.longDescription}
                  onChange={(e) => setEditForm(prev => ({ ...prev, longDescription: e.target.value }))}
                  rows={6}
                  className="w-full px-5 py-3 rounded-xl border border-slate-200 focus:border-brand-primary outline-none resize-none"
                  placeholder="Detailed description for book page"
                  aria-label="Long Description"
                />
              </div>

              {/* Uploads */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-6 rounded-2xl bg-slate-50 border border-dashed border-slate-200 text-center">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Book Cover Image</label>
                  {editForm.imageUrl ? (
                    <div className="relative group mx-auto w-32 h-44 mb-4">
                      <img src={editForm.imageUrl} className="w-full h-full object-cover rounded-lg shadow-md" alt="Book cover preview" />
                      <button 
                        onClick={() => setEditForm(p => ({...p, imageUrl: ''}))}
                        className="absolute top-2 right-2 p-1 bg-white text-red-500 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label="Remove image"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ) : (
                    <label className="cursor-pointer block">
                      <div className="w-16 h-16 bg-white rounded-xl shadow-sm flex items-center justify-center mx-auto text-brand-primary mb-3">
                        <Upload size={24} />
                      </div>
                      <span className="text-sm font-bold text-slate-500">Choose Image</span>
                      <input type="file" onChange={(e) => handleFileUpload(e, 'imageUrl')} className="hidden" accept="image/*" />
                    </label>
                  )}
                </div>

                <div className="p-6 rounded-2xl bg-slate-50 border border-dashed border-slate-200 text-center">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Digital Resource (PDF)</label>
                  {editForm.blobUrl ? (
                    <div className="flex flex-col items-center">
                      <CheckCircle className="text-green-500 mb-2" size={32} />
                      <span className="text-sm font-medium text-slate-600 truncate max-w-full px-4 mb-2">Resource Uploaded</span>
                      <button 
                        onClick={() => setEditForm(p => ({...p, blobUrl: ''}))}
                        className="text-xs font-bold text-red-500 hover:text-red-600 transition-colors uppercase tracking-widest"
                      >
                        Remove & Replace
                      </button>
                    </div>
                  ) : (
                    <label className="cursor-pointer block">
                      <div className="w-16 h-16 bg-white rounded-xl shadow-sm flex items-center justify-center mx-auto text-brand-accent mb-3">
                        <Upload size={24} />
                      </div>
                      <span className="text-sm font-bold text-slate-500">Choose PDF</span>
                      <input type="file" onChange={(e) => handleFileUpload(e, 'blobUrl')} className="hidden" accept="application/pdf" />
                    </label>
                  )}
                </div>
              </div>
            </div>

            <div className="p-8 border-t border-slate-100 bg-slate-50 flex gap-4 mt-auto">
              <button 
                onClick={handleSave}
                disabled={isLoading}
                className={`flex-grow inline-flex items-center justify-center gap-2 bg-brand-dark text-white py-4 rounded-xl font-bold transition-all shadow-lg ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-slate-800'}`}
              >
                <Save size={20} /> {isLoading ? 'Saving...' : 'Save Book'}
              </button>
              <button 
                onClick={() => setIsEditing(null)}
                className="px-8 py-4 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
