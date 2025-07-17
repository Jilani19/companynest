import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/api";
import { useAuth } from "../context/AuthContext";
import styles from "../styles/EdittCompanyForm.module.css";

function EditCompanyForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { username, password, isLoggedIn } = useAuth();

  const [formData, setFormData] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/admin/login");
      return;
    }
    fetchCompany();
  }, []);

  const fetchCompany = async () => {
    try {
      const res = await API.get("/companies", {
        headers: { username, password },
      });
      const selected = res.data.find((item) => item._id === id);
      if (selected) {
        setFormData(selected);
      } else {
        setMessage("Company not found.");
      }
    } catch (err) {
      setMessage("❌ Failed to load company.");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/companies/${id}`, formData, {
        headers: { username, password },
      });
      setMessage("✅ Company updated successfully!");
      setTimeout(() => navigate("/admin/companylist"), 1000);
    } catch (err) {
      setMessage("❌ Update failed.");
    }
  };

  if (!formData) return <p className={styles.loading}>Loading...</p>;

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Edit Company</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          name="companyName"
          placeholder="Company Name"
          value={formData.companyName}
          onChange={handleChange}
        />
        <input
          type="text"
          name="website"
          placeholder="Website"
          value={formData.website}
          onChange={handleChange}
        />
        <input
          type="text"
          name="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleChange}
        />
        <input
          type="text"
          name="city"
          placeholder="City"
          value={formData.city}
          onChange={handleChange}
        />
        <input
          type="text"
          name="zipCode"
          placeholder="ZIP Code"
          value={formData.zipCode}
          onChange={handleChange}
        />
        <input
          type="text"
          name="createdBy"
          placeholder="Created By"
          value={formData.createdBy}
          onChange={handleChange}
        />
        <button type="submit" className={styles.submitBtn}>Update Company</button>
      </form>
      {message && <p className={styles.message}>{message}</p>}
    </div>
  );
}

export default EditCompanyForm;
