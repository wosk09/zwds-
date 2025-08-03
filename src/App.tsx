// src/App.tsx
import React, { useState } from "react";
import { Iztrolabe } from "./Iztrolabe/Iztrolabe";
import "./Iztrolabe/Iztrolabe.css";
import "./theme/default.css";

function App() {
  const [formData, setFormData] = useState({
    birthday: "",
    birthTime: 0,
    gender: "female",
    birthdayType: "solar",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "birthTime" ? parseInt(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div style={{ padding: "1rem" }}>
      {!submitted && (
        <form onSubmit={handleSubmit}>
          <label>
            Birthday:
            <input type="date" name="birthday" value={formData.birthday} onChange={handleChange} required />
          </label>
          <label>
            Birth Time (0–11):
            <input type="number" name="birthTime" value={formData.birthTime} onChange={handleChange} min={0} max={11} required />
          </label>
          <label>
            Gender:
            <select name="gender" value={formData.gender} onChange={handleChange}>
              <option value="female">Female</option>
              <option value="male">Male</option>
            </select>
          </label>
          <label>
            Birthday Type:
            <select name="birthdayType" value={formData.birthdayType} onChange={handleChange}>
              <option value="solar">Solar</option>
              <option value="lunar">Lunar</option>
            </select>
          </label>
          <button type="submit">Show Chart</button>
        </form>
      )}

      {submitted && (
        <Iztrolabe
          birthday={formData.birthday}
          birthTime={formData.birthTime}
          gender={formData.gender}
          birthdayType={formData.birthdayType}
          isLeapMonth={false}
          fixLeap={true}
          lang="zh-CN"
          astroType="heaven"
          centerPalaceAlign={false}
          options={{ yearDivide: "exact" }}
        />
      )}
    </div>
  );
}

export default App;

