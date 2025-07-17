import React, { useState, useEffect, useRef } from "react";
import API from "../api/api";
import { Link } from "react-router-dom";
import styles from "../styles/CompanyForm.module.css";

function CompanyForm() {
  const [formData, setFormData] = useState({
    companyName: "",
    website: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    createdBy: "",
  });

  const [message, setMessage] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [companyExists, setCompanyExists] = useState(false);
  const [loading, setLoading] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setSuggestions([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const name = formData.companyName.trim();
    if (name.length < 2) {
      setSuggestions([]);
      setCompanyExists(false);
      return;
    }

    const fetchSuggestions = async () => {
      setLoading(true);
      try {
        const res = await API.get(`/companies/names`, {
          params: { search: name },
        });
        setSuggestions(res.data || []);
        const alreadyExists = res.data?.some(
          (n) => n.toLowerCase() === name.toLowerCase()
        );
        setCompanyExists(alreadyExists);
      } catch (err) {
        console.error("Suggestion fetch failed", err);
      } finally {
        setLoading(false);
      }
    };

    const delay = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(delay);
  }, [formData.companyName]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setMessage("");
  };

  const handleSelectSuggestion = (name) => {
    setFormData({ ...formData, companyName: name });
    setSuggestions([]);
    setCompanyExists(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      await API.post("/companies", formData);
      setMessage("✅ Company submitted successfully!");
      setFormData({
        companyName: "",
        website: "",
        address: "",
        city: "",
        state: "",
        zipCode: "",
        country: "",
        createdBy: "",
      });
      setSuggestions([]);
      setCompanyExists(false);
    } catch (err) {
      if (err.response?.status === 409) {
        setMessage("⚠️ Company already exists.");
      } else {
        setMessage("❌ Submission failed.");
        console.error("Submission error", err);
      }
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Submit a Company</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.suggestionWrapper} ref={wrapperRef}>
          <input
            name="companyName"
            placeholder="Company Name"
            value={formData.companyName}
            onChange={handleChange}
            required
            autoComplete="off"
            className={`${styles.input} ${
              companyExists ? styles.inputWarning : ""
            }`}
          />
          {(loading || suggestions.length > 0) && (
            <div className={styles.suggestions}>
              {loading ? (
                <div className={styles.loader}>🔍 Searching...</div>
              ) : (
                suggestions.map((name, index) => (
                  <div
                    key={index}
                    onMouseDown={() => handleSelectSuggestion(name)}
                    className={styles.suggestionItem}
                  >
                    {name}
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {companyExists && (
          <p className={styles.warning}>⚠️ This company already exists!</p>
        )}

        <input
          name="website"
          placeholder="Website"
          value={formData.website}
          onChange={handleChange}
          required
          className={styles.input}
        />

        <input
          name="address"
          placeholder="Address (e.g., Door No, Street, Road)"
          value={formData.address}
          onChange={handleChange}
          required
          className={styles.input}
        />

        <input
          name="city"
          placeholder="City"
          value={formData.city}
          onChange={handleChange}
          required
          className={styles.input}
        />

        <input
          name="state"
          placeholder="State / Province"
          value={formData.state}
          onChange={handleChange}
          required
          className={styles.input}
        />

        <input
          name="zipCode"
          placeholder="ZIP / Postal Code"
          value={formData.zipCode}
          onChange={handleChange}
          required
          className={styles.input}
        />

        <input
          name="country"
          placeholder="Country"
          value={formData.country}
          onChange={handleChange}
          required
          className={styles.input}
        />

        <input
          name="createdBy"
          placeholder="Created By"
          value={formData.createdBy}
          onChange={handleChange}
          required
          className={styles.input}
        />

        <button
          type="submit"
          className={styles.button}
          disabled={companyExists}
        >
          Submit
        </button>
      </form>

      <p className={styles.message}>{message}</p>

      <div className={styles.adminLink}>
        <Link to="/admin/login">🔐 Admin Login</Link>
      </div>
    </div>
  );
}

export default CompanyForm;
