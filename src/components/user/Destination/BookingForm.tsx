import FormInput from "./FormInput";
import FormTextArea from "./FormTextArea";

export default function BookingForm({ formData, errors, onChange, onDateChange, onNumberChange, onSubmit }: any) {
  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6">Booking Information</h2>
      <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <div className="md:col-span-2">
          <h3 className="text-lg font-semibold mb-3">Personal Details</h3>
        </div>

        <FormInput 
          label="Full Name" 
          name="name" 
          value={formData.name} 
          onChange={onChange} 
          error={errors.name} 
          required 
        />
        <FormInput 
          label="Email" 
          name="email" 
          type="email" 
          value={formData.email} 
          onChange={onChange} 
          error={errors.email} 
          required 
        />
        <FormInput 
          label="Phone Number" 
          name="phone" 
          type="tel" 
          value={formData.phone} 
          onChange={onChange} 
          error={errors.phone} 
          required 
        />
        <FormInput 
          label="Address" 
          name="address" 
          value={formData.address} 
          onChange={onChange} 
          error={errors.address} 
          required 
        />

        <div className="md:col-span-2">
          <h3 className="text-lg font-semibold mb-3">Trip Details</h3>
        </div>

        <FormInput 
          label="Start Date" 
          name="startDate" 
          type="date" 
          value={formData.startDate} 
          onChange={onDateChange} 
          error={errors.startDate} 
          required 
          min={new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]} 
        />
        <FormInput 
          label="End Date" 
          name="endDate" 
          type="date" 
          value={formData.endDate} 
          onChange={onDateChange} 
          error={errors.endDate} 
          required 
          min={formData.startDate || new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]} 
        />
        <FormInput 
          label="Number of Days" 
          name="days" 
          type="number" 
          value={formData.days} 
          onChange={onNumberChange} 
          readOnly 
        />

        <div className="md:col-span-2">
          <FormTextArea 
            label="Special Requests" 
            name="specialRequests" 
            value={formData.specialRequests} 
            onChange={onChange} 
            placeholder="Any special requirements or preferences..." 
          />
        </div>

        <div className="md:col-span-2 flex justify-end">
          <button
            type="submit"
            disabled={
              !formData.name || 
              !formData.email || 
              !formData.phone || 
              !formData.address || 
              !formData.startDate || 
              !formData.endDate || 
              !formData.selectedDestinations.length
            }
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              formData.name && 
              formData.email && 
              formData.phone && 
              formData.address && 
              formData.startDate && 
              formData.endDate && 
              formData.selectedDestinations.length
                ? "bg-[#9B8759] text-white hover:bg-[#8a7a4d]"
                : "bg-gray-400 text-gray-200 cursor-not-allowed"
            }`}
          >
            Submit Booking Request
          </button>
        </div>
      </form>
    </div>
  );
}
