// frontend/src/pages/RegisterPage.jsx
// 125Customs Register Page
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../stores/authStore';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

function RegisterPage() {
  const navigate = useNavigate();
  const { register, loading, error } = useAuthStore(state => ({
    register: state.register,
    loading: state.loading,
    error: state.error
  }));
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(formData.name, formData.email, formData.password);
      // Auto-login after registration or redirect to login
      navigate('/login', { replace: true });
    } catch (err) {
      // Error already handled by store
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 py-12 flex items-center justify-center">
      <div className="w-full max-w-xs space-y-6">
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Create Your 125Customs Account
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <Input 
              type="text" 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              required 
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <Input 
              type="email" 
              name="email" 
              value={formData.email} 
              onChange={handleChange} 
              required 
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <Input 
              type="password" 
              name="password" 
              value={formData.password} 
              onChange={handleChange} 
              required 
              className="w-full"
              minLength={6}
            />
          </div>
          
          <Button 
            type="submit" 
            isLoading={loading} 
            className="w-full"
          >
            Create Account
          </Button>
          
          <div className="text-sm text-center">
            <p className="text-gray-500">
              Already have an account?{" "}
              <a href="/login" className="text-red-600 hover:underline">
                Sign in
              </a>
            </p>
          </div>
        </form>
        
        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded text-red-600">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}

export default RegisterPage;
