import React, { useState } from 'react';
import { Button, Input } from "@material-tailwind/react";

const LoanForm = () => {
  const [formData, setFormData] = useState({
    binusian_id: "",
    name: "",
    email: "",
    address: "",
    phone: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    alert("Form Submitted!");
  };

  return (
    <div className="container mx-auto p-4">
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <Input 
          type="text" 
          name="binusian_id" 
          label="Binusian ID" 
          required 
          value={formData.binusian_id} 
          onChange={handleChange} 
        />
        
        <Input 
          type="text" 
          name="name" 
          label="Name" 
          required 
          value={formData.name} 
          onChange={handleChange} 
        />

        <Input 
          type="email" 
          name="email" 
          label="Email" 
          required 
          value={formData.email} 
          onChange={handleChange} 
        />

        <Input 
          type="text" 
          name="address" 
          label="Address" 
          value={formData.address} 
          onChange={handleChange} 
        />

        <Input 
          type="tel" 
          name="phone" 
          label="Phone" 
          value={formData.phone} 
          onChange={handleChange} 
        />

        <Button color="green" type="submit">Submit</Button>
      </form>
    </div>
  );
};

export default LoanForm;
