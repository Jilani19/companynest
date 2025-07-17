import React, { useEffect, useState } from "react";
import API from "../api/api";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import styles from "../styles/AdminCompanyList.module.css";

function AdminCompanyList() {
  const { isLoggedIn, logout } = useAuth();
  const [companies, setCompanies] = useState([]);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("");
  const [viewMode, setViewMode] = useState("card");
  const [cities, setCities] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const companiesPerPage = 6;

  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/admin/login");
      return;
    }
    fetchCompanies();
  }, []);

  useEffect(() => {
    filterCompanies();
    setCurrentPage(1);
  }, [search, city, companies]);

  const fetchCompanies = async () => {
    const token = localStorage.getItem("adminToken");
    try {
      const res = await API.get("/companies", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCompanies(res.data);
      const uniqueCities = [...new Set(res.data.map((c) => c.city))];
      setCities(uniqueCities);
    } catch (err) {
      alert("Failed to fetch companies");
    }
  };

  const filterCompanies = () => {
    let data = [...companies];
    if (search) {
      data = data.filter((c) =>
        c.companyName.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (city) {
      data = data.filter((c) => c.city === city);
    }
    setFilteredCompanies(data);
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("adminToken");
    if (!window.confirm("Are you sure you want to delete this company?")) return;
    try {
      await API.delete(`/companies/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCompanies(companies.filter((c) => c._id !== id));
    } catch (err) {
      alert("Delete failed");
    }
  };

  const indexOfLast = currentPage * companiesPerPage;
  const indexOfFirst = indexOfLast - companiesPerPage;
  const currentCompanies = filteredCompanies.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredCompanies.length / companiesPerPage);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Company Management</h2>
        <button className={styles.logoutBtn} onClick={logout}>Logout</button>
      </div>

      <div className={styles.toolbar}>
        <input
          className={styles.searchInput}
          type="text"
          placeholder="🔍 Search by company name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className={styles.selectDropdown}
          value={city}
          onChange={(e) => setCity(e.target.value)}
        >
          <option value="">All Cities</option>
          {cities.map((c, i) => (
            <option key={i} value={c}>{c}</option>
          ))}
        </select>
        <button
          className={styles.toggleViewBtn}
          onClick={() => setViewMode(viewMode === "card" ? "table" : "card")}
        >
          {viewMode === "card" ? "Switch to Table View" : "Switch to Card View"}
        </button>
      </div>

      {viewMode === "card" ? (
        <div className={styles.gridContainer}>
          {currentCompanies.length > 0 ? (
            currentCompanies.map((company) => (
              <div key={company._id} className={styles.card}>
                <div className={styles.cardHeader}>
                  <h3>{company.companyName}</h3>
                  <p>{company.city}</p>
                </div>
                <div className={styles.cardBody}>
                  <p>
                    🌐 <a href={company.website} target="_blank" rel="noreferrer">{company.website}</a>
                  </p>
                  <p>🧑‍💼 {company.createdBy}</p>
                </div>
                <div className={styles.cardActions}>
                  <Link to={`/admin/edit/${company._id}`}>
                    <button className={styles.editBtn}>Edit</button>
                  </Link>
                  <button className={styles.deleteBtn} onClick={() => handleDelete(company._id)}>Delete</button>
                </div>
              </div>
            ))
          ) : (
            <p className={styles.noData}>No companies found.</p>
          )}
        </div>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Company</th>
              <th>Website</th>
              <th>City</th>
              <th>Created By</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentCompanies.length > 0 ? (
              currentCompanies.map((company) => (
                <tr key={company._id}>
                  <td>{company.companyName}</td>
                  <td>
                    <a href={company.website} target="_blank" rel="noreferrer">
                      {company.website}
                    </a>
                  </td>
                  <td>{company.city}</td>
                  <td>{company.createdBy}</td>
                  <td>
                    <Link to={`/admin/edit/${company._id}`}>
                      <button className={styles.editBtn}>Edit</button>
                    </Link>
                    <button className={styles.deleteBtn} onClick={() => handleDelete(company._id)}>Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className={styles.noData}>No companies found.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      {totalPages > 1 && (
        <div className={styles.pagination}>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              className={`${styles.pageBtn} ${currentPage === i + 1 ? styles.activePage : ""}`}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminCompanyList;
