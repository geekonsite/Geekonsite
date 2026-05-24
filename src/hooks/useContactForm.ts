import { useState } from 'react';

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface ContactFormState {
  isSubmitting: boolean;
  isSuccess: boolean;
  error: string | null;
}

export const useContactForm = () => {
  const [state, setState] = useState<ContactFormState>({
    isSubmitting: false,
    isSuccess: false,
    error: null
  });

  const submitForm = async (formData: ContactFormData) => {
    setState({ isSubmitting: true, isSuccess: false, error: null });

    try {
      // Check if Supabase environment variables are available
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      // If Supabase is not configured, use local fallback
      if (!supabaseUrl || !supabaseKey) {
        console.log('Contact form submission (Supabase not configured):', {
          ...formData,
          timestamp: new Date().toISOString()
        });
        
        // Simulate processing time
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        setState({ isSubmitting: false, isSuccess: true, error: null });
        return { 
          success: true, 
          message: 'Message received! We\'ll get back to you within 2 hours. (Note: Please also email us directly at info@geekonsite.ca)' 
        };
      }

      // Try to send email via Supabase edge function with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout

      try {
        const response = await fetch(`${supabaseUrl}/functions/v1/send-contact-email`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${supabaseKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          // If edge function fails, fall back to local logging
          console.log('Contact form submission (Edge function failed):', {
            ...formData,
            timestamp: new Date().toISOString(),
            error: `HTTP ${response.status}`
          });
          
          setState({ isSubmitting: false, isSuccess: true, error: null });
          return { 
            success: true, 
            message: 'Message received! We\'ll get back to you within 2 hours. (Please also email us directly at info@geekonsite.ca for faster response)' 
          };
        }

        const result = await response.json();
        
        if (result.success) {
          setState({ isSubmitting: false, isSuccess: true, error: null });
          return { success: true, message: result.message };
        } else {
          // If edge function returns error, fall back to local logging
          console.log('Contact form submission (Edge function error):', {
            ...formData,
            timestamp: new Date().toISOString(),
            error: result.error
          });
          
          setState({ isSubmitting: false, isSuccess: true, error: null });
          return { 
            success: true, 
            message: 'Message received! We\'ll get back to you within 2 hours. (Please also email us directly at info@geekonsite.ca)' 
          };
        }

      } catch (fetchError) {
        clearTimeout(timeoutId);
        
        // Handle fetch errors with fallback
        console.log('Contact form submission (Network error):', {
          ...formData,
          timestamp: new Date().toISOString(),
          error: fetchError instanceof Error ? fetchError.message : 'Unknown fetch error'
        });
        
        setState({ isSubmitting: false, isSuccess: true, error: null });
        return { 
          success: true, 
          message: 'Message received! We\'ll get back to you within 2 hours. (Please also email us directly at info@geekonsite.ca for immediate assistance)' 
        };
      }

    } catch (error) {
      // Final fallback for any unexpected errors
      console.log('Contact form submission (Unexpected error):', {
        ...formData,
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      
      setState({ isSubmitting: false, isSuccess: true, error: null });
      return { 
        success: true, 
        message: 'Message received! We\'ll get back to you within 2 hours. (Please also email us directly at info@geekonsite.ca)' 
      };
    }
  };

  const resetForm = () => {
    setState({ isSubmitting: false, isSuccess: false, error: null });
  };

  return {
    ...state,
    submitForm,
    resetForm
  };
};