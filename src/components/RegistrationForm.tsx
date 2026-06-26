import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { CheckCircle, Circle, Loader2 } from 'lucide-react';

const INTEREST_OPTIONS = [
  'Competitive Programming',
  'Web/App Development',
  'Cybersecurity',
  'Robotics & IoT',
  'AI & Data Science',
  'UI/UX Design',
  'Event Management',
  'Content Writing & PR',
  'Others',
];

function getSemesterOrdinal(email: string) {
  if (!email || !email.includes('@')) return '';
  const idPart = email.split('@')[0];
  if (idPart.length < 3) return '';
  
  const yearStr = idPart.substring(0, 2);
  const termStr = idPart.substring(2, 3); // 1=Autumn, 2=Spring, 3=Summer
  
  const admissionYear = 2000 + parseInt(yearStr, 10);
  const admissionCode = parseInt(termStr, 10);
  
  if (isNaN(admissionYear) || isNaN(admissionCode)) return '';

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;

  let currentCode = 2; // Spring
  if (currentMonth >= 5 && currentMonth <= 8) currentCode = 3; // Summer
  else if (currentMonth >= 9) currentCode = 1; // Autumn

  const getAbs = (y: number, c: number) => {
    let t = 0;
    if (c === 2) t = 0; // Spring
    if (c === 3) t = 1; // Summer
    if (c === 1) t = 2; // Autumn
    return y * 3 + t;
  };

  const diff = getAbs(currentYear, currentCode) - getAbs(admissionYear, admissionCode) + 1;
  const ordinal = diff > 0 ? diff : 1;

  const s = ["th", "st", "nd", "rd"];
  const v = ordinal % 100;
  return ordinal + (s[(v - 20) % 10] || s[v] || s[0]);
}

export default function RegistrationForm({ 
  user, 
  onSuccess 
}: { 
  user: any, 
  onSuccess: () => void 
}) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(() => {
    let autoId = '';
    let autoSemester = '';
    
    if (user?.email && user.email.endsWith('@iub.edu.bd')) {
      autoId = user.email.split('@')[0];
      autoSemester = getSemesterOrdinal(user.email);
    }
    
    return {
      name: user?.user_metadata?.full_name || '',
      iub_id: autoId,
      department: '',
      semester: autoSemester,
      residence_area: '',
      contact_number: '',
      facebook_link: '',
      blood_group: '',
      notes: '',
      payment_method: 'Bkash',
      bkash_transaction_id: '',
      bkash_sender_number: '',
      executive_id: '',
    };
  });
  
  const [interests, setInterests] = useState<string[]>([]);
  const [otherExpertise, setOtherExpertise] = useState("");
  const [error, setError] = useState<string | null>(null);

  const toggleInterest = (interest: string) => {
    setInterests(prev => 
      prev.includes(interest) 
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    // Validate executive ID
    const validIdsStr = import.meta.env.VITE_VALID_EXECUTIVE_IDS || '';
    const validIds = validIdsStr.split(',').map(id => id.trim()).filter(id => id);
    
    if (validIds.length > 0 && !validIds.includes(formData.executive_id.trim())) {
      setError('Invalid Executive ID. Please check with your executive member.');
      setLoading(false);
      return;
    }
    
    const finalInterests = interests.map(i => i === 'Others' ? (otherExpertise.trim() || 'Others') : i);
    
    // In a real app, we insert to supabase.
    try {
      const { error: dbError } = await supabase.from('members').insert([
        {
          id: user.id,
          email: user.email,
          ...formData,
          fields_of_interest: finalInterests,
        }
      ]);
      
      if (dbError) throw dbError;
      
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.message || 'Something went wrong during registration.');
      setLoading(false);
      return;
    }
    
    setLoading(false);
    onSuccess();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-12 px-4">
      <div className="glass-panel p-6 md:p-10 w-full max-w-2xl">
        <h2 className="text-3xl font-bold mb-2">Complete Registration</h2>
        <p className="text-white/70 mb-8">Please fill in your details to join Jukti Club.</p>
        
        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-100 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Full Name</label>
              <input required readOnly name="name" value={formData.name} onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white/70 cursor-not-allowed focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">IUB ID</label>
              <input required readOnly name="iub_id" value={formData.iub_id} onChange={handleChange}
                placeholder="e.g. 2120000"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white/70 cursor-not-allowed focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Department</label>
              <input required name="department" value={formData.department} onChange={handleChange}
                placeholder="e.g. CSE"
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 focus:outline-none focus:border-brand-orange text-white" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Semester</label>
              <input required readOnly name="semester" value={formData.semester} onChange={handleChange}
                placeholder="e.g. 1st"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white/70 cursor-not-allowed focus:outline-none" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Residence Area</label>
              <input required name="residence_area" value={formData.residence_area} onChange={handleChange}
                placeholder="e.g. Bashundhara R/A, Dhaka"
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 focus:outline-none focus:border-brand-orange text-white" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Contact Number</label>
              <input required name="contact_number" value={formData.contact_number} onChange={handleChange}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 focus:outline-none focus:border-brand-orange text-white" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Facebook ID Link</label>
              <input required name="facebook_link" value={formData.facebook_link} onChange={handleChange}
                placeholder="e.g. facebook.com/username"
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 focus:outline-none focus:border-brand-orange text-white" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Blood Group (Optional)</label>
              <select name="blood_group" value={formData.blood_group} onChange={handleChange}
                className="w-full bg-black/40 border border-white/20 rounded-lg px-4 py-3 focus:outline-none focus:border-brand-orange text-white appearance-none">
                <option value="">Select Group</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>
          </div>

          <div className="pt-4">
            <label className="block text-sm font-medium mb-4">Fields of Expertise</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {INTEREST_OPTIONS.map(opt => {
                const isSelected = interests.includes(opt);
                return (
                  <div key={opt} className="flex flex-col gap-2">
                    <div 
                      onClick={() => toggleInterest(opt)}
                      className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer border transition-colors ${
                        isSelected ? 'bg-brand-orange/20 border-brand-orange' : 'bg-white/5 border-white/10 hover:bg-white/10'
                      }`}
                    >
                      {isSelected ? <CheckCircle className="text-brand-orange" size={20} /> : <Circle className="text-white/40" size={20} />}
                      <span className="text-sm">{opt}</span>
                    </div>
                    {opt === 'Others' && isSelected && (
                      <input 
                        type="text"
                        value={otherExpertise}
                        onChange={(e) => setOtherExpertise(e.target.value)}
                        placeholder="Please specify..."
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-brand-orange text-white mt-1"
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-4">
            <label className="block text-sm font-medium mb-4">Payment Option</label>
            <div className="flex gap-4 mb-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="payment_method" value="Bkash" 
                  checked={formData.payment_method === 'Bkash'} onChange={handleChange} 
                  className="accent-brand-orange w-4 h-4 cursor-pointer" />
                <span>Bkash</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="payment_method" value="Cash" 
                  checked={formData.payment_method === 'Cash'} onChange={handleChange} 
                  className="accent-brand-orange w-4 h-4 cursor-pointer" />
                <span>Cash</span>
              </label>
            </div>

            {formData.payment_method === 'Bkash' ? (
              <div className="bg-brand-orange/10 border border-brand-orange/30 rounded-lg p-5 mb-4 space-y-4">
                <div>
                  <p className="text-sm mb-1">Please send the registration fee to the following Bkash Number (Personal):</p>
                  <p className="font-mono text-xl font-semibold tracking-wider">017XX-XXXXXX</p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Sender Number</label>
                  <input required name="bkash_sender_number" value={formData.bkash_sender_number} onChange={handleChange}
                    placeholder="e.g. 017..."
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 focus:outline-none focus:border-brand-orange text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Transaction ID</label>
                  <input required name="bkash_transaction_id" value={formData.bkash_transaction_id} onChange={handleChange}
                    placeholder="e.g. 9F8D7E..."
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 focus:outline-none focus:border-brand-orange text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Executive ID</label>
                  <input required type="password" name="executive_id" value={formData.executive_id} onChange={handleChange}
                    placeholder="e.g. EX-101"
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 focus:outline-none focus:border-brand-orange text-white" />
                </div>
              </div>
            ) : (
              <div className="bg-white/5 border border-white/10 rounded-lg p-5 mb-4">
                <p className="text-sm mb-3">Please hand over the fee to an Executive Member and enter their ID to verify.</p>
                <label className="block text-sm font-medium mb-2">Executive ID</label>
                <input required type="password" name="executive_id" value={formData.executive_id} onChange={handleChange}
                  placeholder="e.g. EX-101"
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 focus:outline-none focus:border-brand-orange text-white" />
              </div>
            )}
          </div>
          
          <div className="pt-2">
            <label className="block text-sm font-medium mb-2">Additional Notes (Optional)</label>
            <textarea 
              name="notes" 
              value={formData.notes} 
              onChange={handleChange as any}
              rows={3}
              placeholder="Any comments, expectations, or things we should know..."
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 focus:outline-none focus:border-brand-orange text-white resize-none" 
            />
          </div>

          <button 
            disabled={loading || interests.length === 0}
            type="submit"
            className="w-full bg-brand-orange text-white py-4 rounded-xl font-bold flex justify-center items-center gap-2 hover:bg-brand-orange/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-8"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : 'Complete Registration'}
          </button>
        </form>
      </div>
    </div>
  );
}
