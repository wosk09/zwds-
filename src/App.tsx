import React, { useState } from "react";
import { Iztrolabe } from "./Iztrolabe/Iztrolabe";
import "./Iztrolabe/Iztrolabe.css";
import "./theme/default.css";

type Gender = "male" | "female";
type BirthdayType = "solar" | "lunar";

/**
 * Преобразует часы и минуты в китайский час (0–11).
 */
function getChineseHourIndex(hour: number, minute: number): number {
  if (hour === 23 || hour === 0) return 0;
  return Math.floor((hour + 1) / 2);
}

function App() {
  const [formData, setFormData] = useState<{
    birthday: string;
    birthHour: number;
    birthMinute: number;
    gender: "мужской" | "женский";
    birthdayType: BirthdayType;
  }>({
    birthday: "",
    birthHour: 12,
    birthMinute: 0,
    gender: "женский",
    birthdayType: "solar",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "birthHour" || name === "birthMinute" ? parseInt(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleBack = () => {
    setSubmitted(false);
  };

  const genderMap: Record<string, Gender> = {
    женский: "female",
    мужской: "male",
  };

  const chineseHour = getChineseHourIndex(
    formData.birthHour,
    formData.birthMinute
  );

  return (
    <div style={{ padding: "1rem" }}>
      {!submitted && (
        <form onSubmit={handleSubmit} className="zwds-form">
          <label className="zwds-label">
            Дата рождения:
            <input
              type="date"
              name="birthday"
              value={formData.birthday}
              onChange={handleChange}
              required
            />
          </label>

          <label className="zwds-label">
            Час рождения (0–23):
            <input
              type="number"
              name="birthHour"
              value={formData.birthHour}
              onChange={handleChange}
              min={0}
              max={23}
              required
            />
          </label>

          <label className="zwds-label">
            Минуты:
            <input
              type="number"
              name="birthMinute"
              value={formData.birthMinute}
              onChange={handleChange}
              min={0}
              max={59}
              required
            />
          </label>

          <label className="zwds-label">
            Пол:
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
            >
              <option value="женский">Женский</option>
              <option value="мужской">Мужской</option>
            </select>
          </label>

          <label className="zwds-label">
            Тип даты:
            <select
              name="birthdayType"
              value={formData.birthdayType}
              onChange={handleChange}
            >
              <option value="solar">Солнечная</option>
              <option value="lunar">Лунная</option>
            </select>
          </label>

          <button type="submit" className="zwds-button">
            Показать карту
          </button>
        </form>
      )}

      {submitted && (
        <>
          <button onClick={handleBack} className="zwds-button" style={{ marginBottom: "1rem" }}>
            ← Назад
          </button>
          <Iztrolabe
            birthday={formData.birthday}
            birthTime={chineseHour}
            gender={genderMap[formData.gender]}
            birthdayType={formData.birthdayType}
            isLeapMonth={false}
            fixLeap={true}
            lang="en-US"
            astroType="heaven"
            centerPalaceAlign={false}
            options={{ yearDivide: "exact" }}
          />
        </>
      )}
    </div>
  );
}

export default App;
