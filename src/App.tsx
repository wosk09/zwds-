import React, { useState } from "react";
import { Iztrolabe } from "./Iztrolabe/Iztrolabe";
import "./Iztrolabe/Iztrolabe.css";
import "./theme/default.css";

/**
 * Основное приложение калькулятора Zi Wei Dou Shu.
 *
 * Здесь отображается форма для ввода данных рождения и полов, после отправки
 * отображается диаграмма астролябии. Все надписи переведены на русский язык,
 * а звёзды и дворцы выводятся на английском языке благодаря параметру
 * `lang="en-US"` в компоненте `Iztrolabe`.
 */
function App() {
  // Состояние для хранения введённых пользователем данных
  type Gender = 'male' | 'female';
type BirthdayType = 'solar' | 'lunar';

const [formData, setFormData] = useState<{
  birthday: string;
  birthTime: number;
  gender: Gender;
  birthdayType: BirthdayType;
}>({
  birthday: "",
  birthTime: 0,
  gender: "female",
  birthdayType: "solar",
});
  const [submitted, setSubmitted] = useState(false);

  /**
   * Обработчик изменений в форме. Обновляет соответствующее поле состояния.
   */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "birthTime" ? parseInt(value) : value,
    }));
  };

  /**
   * Обработчик отправки формы. Скрывает форму и показывает астролябий.
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

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
            Время рождения (0–11):
            <input
              type="number"
              name="birthTime"
              value={formData.birthTime}
              onChange={handleChange}
              min={0}
              max={11}
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
              <option value="female">Женский</option>
              <option value="male">Мужской</option>
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
       <Iztrolabe
          birthday={formData.birthday}
          birthTime={formData.birthTime}
          gender={formData.gender as 'male' | 'female'}
          birthdayType={formData.birthdayType as 'solar' | 'lunar'}

          // Лунные месяцы по умолчанию не високосные
          isLeapMonth={false}
          // Коррекция високосных месяцев по умолчанию включена
          fixLeap={true}
          // Звёздные названия и названия дворцов выводим на английском
          lang="en-US"
          // Тип астролябии: небесная
          astroType="heaven"
          // Выравнивание центрального дворца по центру отключено
          centerPalaceAlign={false}
          // Дополнительные параметры расчёта
          options={{ yearDivide: "exact" }}
        />
      )}
    </div>
  );
}

export default App;
