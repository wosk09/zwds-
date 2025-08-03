import classNames from "classnames";
import React, { useCallback, useMemo } from "react";
import FunctionalAstrolabe from "iztro/lib/astro/FunctionalAstrolabe";
import "./IzpalaceCenter.css";
import { Line } from "./Line";
import { fixEarthlyBranchIndex } from "iztro/lib/utils";
import { Scope } from "iztro/lib/data/types";
import { IFunctionalHoroscope } from "iztro/lib/astro/FunctionalHoroscope";
import { normalizeDateStr, solar2lunar } from "lunar-lite";
import { GenderName, kot, t } from "iztro/lib/i18n";
import { CHINESE_TIME } from "iztro/lib/data";

// Типы свойств для компонента центрального дворца
type IzpalaceCenterProps = {
  astrolabe?: FunctionalAstrolabe;
  horoscope?: IFunctionalHoroscope;
  horoscopeDate?: string | Date;
  horoscopeHour?: number;
  arrowIndex?: number;
  arrowScope?: Scope;
  setHoroscopeDate?: React.Dispatch<
    React.SetStateAction<string | Date | undefined>
  >;
  setHoroscopeHour?: React.Dispatch<React.SetStateAction<number | undefined>>;
  centerPalaceAlign?: boolean;
};

/**
 * Компонент отображения центрального дворца. Содержит базовую информацию
 * о натальной карте и управление временем (пределы, годы, месяцы, дни и часы).
 * Все статические подписи переведены на русский язык.
 */
export const IzpalaceCenter = ({
  astrolabe,
  horoscope,
  arrowIndex,
  arrowScope,
  horoscopeDate = new Date(),
  horoscopeHour = 0,
  setHoroscopeDate,
  setHoroscopeHour,
  centerPalaceAlign,
}: IzpalaceCenterProps) => {
  // Базовые записи для отображения в центральном дворце
  const records: ItemProps[] = useMemo(
    () => [
      {
        title: "Пять элементов:",
        content: astrolabe?.fiveElementsClass,
      },
      {
        title: "Возраст (по восточному счёту):",
        content: `${horoscope?.age.nominalAge} лет`,
      },
      {
        title: "Четыре столпа:",
        content: astrolabe?.chineseDate,
      },
      {
        title: "Солнечный календарь:",
        content: astrolabe?.solarDate,
      },
      {
        title: "Лунный календарь:",
        content: astrolabe?.lunarDate,
      },
      {
        title: "Час:",
        content: `${astrolabe?.time}(${astrolabe?.timeRange})`,
      },
      {
        title: "Знак (китайский):",
        content: astrolabe?.zodiac,
      },
      {
        title: "Знак зодиака:",
        content: astrolabe?.sign,
      },
      {
        title: "Управитель судьбы:",
        content: astrolabe?.soul,
      },
      {
        title: "Управитель тела:",
        content: astrolabe?.body,
      },
      {
        title: "Палата судьбы:",
        content: astrolabe?.earthlyBranchOfSoulPalace,
      },
      {
        title: "Палата тела:",
        content: astrolabe?.earthlyBranchOfBodyPalace,
      },
    ],
    [astrolabe, horoscope]
  );

  // Расчёт даты и флагов для ограничения перемещения по десятилетиям
  const horoDate = useMemo(() => {
    const dateStr = horoscopeDate ?? new Date();
    const [year, month, date] = normalizeDateStr(dateStr);
    const dt = new Date(year, month - 1, date);

    return {
      solar: `${year}-${month}-${date}`,
      lunar: solar2lunar(dateStr).toString(true),
      prevDecadalDisabled: dt.setFullYear(dt.getFullYear() - 1),
    };
  }, [horoscopeDate]);

  /**
   * Обработчик щелчков по кнопкам управления временем.
   */
  const onHoroscopeButtonClicked = (scope: Scope, value: number) => {
    if (!astrolabe?.solarDate) {
      return true;
    }

    const [year, month, date] = normalizeDateStr(horoscopeDate);
    const dt = new Date(year, month - 1, date);
    const [birthYear, birthMonth, birthDate] = normalizeDateStr(
      astrolabe.solarDate
    );
    const birthday = new Date(birthYear, birthMonth - 1, birthDate);
    let hour = horoscopeHour;

    switch (scope) {
      case "hourly":
        hour = horoscopeHour + value;
        if (horoscopeHour + value > 11) {
          // Если больше последнего часа — переходим на следующий день и сбрасываем час
          dt.setDate(dt.getDate() + 1);
          hour = 0;
        } else if (horoscopeHour + value < 0) {
          // Если меньше первого часа — отнимаем день и устанавливаем последний час
          dt.setDate(dt.getDate() - 1);
          hour = 11;
        }
        break;
      case "daily":
        dt.setDate(dt.getDate() + value);
        break;
      case "monthly":
        dt.setMonth(dt.getMonth() + value);
        break;
      case "yearly":
      case "decadal":
        dt.setFullYear(dt.getFullYear() + value);
        break;
    }

    if (dt.getTime() >= birthday.getTime()) {
      setHoroscopeDate?.(dt);
      setHoroscopeHour?.(hour);
    }
  };

  /**
   * Определяет, заблокирована ли кнопка навигации по указанному диапазону.
   */
  const shouldBeDisabled = useCallback(
    (dateStr: string | Date, scope: Scope, value: number) => {
      if (!astrolabe?.solarDate) {
        return true;
      }

      const [year, month, date] = normalizeDateStr(dateStr);
      const dt = new Date(year, month - 1, date);
      const [birthYear, birthMonth, birthDate] = normalizeDateStr(
        astrolabe.solarDate
      );
      const birthday = new Date(birthYear, birthMonth - 1, birthDate);

      switch (scope) {
        case "hourly":
          if (horoscopeHour + value > 11) {
            dt.setDate(dt.getDate() + 1);
          } else if (horoscopeHour + value < 0) {
            dt.setDate(dt.getDate() - 1);
          }
          break;
        case "daily":
          dt.setDate(dt.getDate() + value);
          break;
        case "monthly":
          dt.setMonth(dt.getMonth() + value);
          break;
        case "yearly":
        case "decadal":
          dt.setFullYear(dt.getFullYear() + value);
          break;
      }

      if (dt.getTime() < birthday.getTime()) {
        return true;
      }
      return false;
    },
    [horoscopeHour, astrolabe]
  );

  return (
    <div
      className={classNames("iztro-center-palace", {
        "iztro-center-palace-centralize": centerPalaceAlign,
      })}
    >
      {astrolabe?.earthlyBranchOfSoulPalace && (
        <Line
          scope={arrowScope}
          index={
            arrowIndex ??
            fixEarthlyBranchIndex(astrolabe.earthlyBranchOfSoulPalace)
          }
        />
      )}
      <h3 className="center-title">
        <span
          className={`gender gender-${kot<GenderName>(
            astrolabe?.gender ?? ""
          )}`}
        >
          {kot<GenderName>(astrolabe?.gender ?? "") === "male" ? "♂" : "♀"}
        </span>
        <span>Основная информация</span>
      </h3>
      <ul className="basic-info">
        {records.map((rec, idx) => (
          <Item key={idx} {...rec} />
        ))}
      </ul>
      <h3 className="center-title">Информация об удаче</h3>
      <ul className="basic-info">
        {/* Показываем текущую лунную дату */}
        <Item title="Лунный календарь:" content={horoDate.lunar} />
        <div
          className={classNames("solar-horoscope", {
            "solar-horoscope-centralize": centerPalaceAlign,
          })}
        >
          {/* Показываем текущую солнечную дату */}
          <Item title="Солнечный календарь:" content={horoDate.solar} />
          <span
            className="today"
            onClick={() => setHoroscopeDate?.(new Date())}
          >
            Сегодня
          </span>
        </div>
      </ul>
      <div className="horo-buttons">
        {/* Кнопки навигации влево */}
        <span
          className={classNames("center-button", {
            disabled: shouldBeDisabled(horoDate.solar, "yearly", -10),
          })}
          onClick={() => onHoroscopeButtonClicked("yearly", -10)}
        >
          ◀ Дек
        </span>
        <span
          className={classNames("center-button", {
            disabled: shouldBeDisabled(horoDate.solar, "yearly", -1),
          })}
          onClick={() => onHoroscopeButtonClicked("yearly", -1)}
        >
          ◀ Год
        </span>
        <span
          className={classNames("center-button", {
            disabled: shouldBeDisabled(horoDate.solar, "monthly", -1),
          })}
          onClick={() => onHoroscopeButtonClicked("monthly", -1)}
        >
          ◀ Мес
        </span>
        <span
          className={classNames("center-button", {
            disabled: shouldBeDisabled(horoDate.solar, "daily", -1),
          })}
          onClick={() => onHoroscopeButtonClicked("daily", -1)}
        >
          ◀ День
        </span>
        <span
          className={classNames("center-button", {
            disabled: shouldBeDisabled(horoDate.solar, "hourly", -1),
          })}
          onClick={() => onHoroscopeButtonClicked("hourly", -1)}
        >
          ◀ Час
        </span>
        {/* Отображаем текущий час (китайское время транслируется через функцию t) */}
        <span className="center-horo-hour">
          {t(CHINESE_TIME[horoscopeHour])}
        </span>
        {/* Кнопки навигации вправо */}
        <span
          className={classNames("center-button")}
          onClick={() => onHoroscopeButtonClicked("hourly", 1)}
        >
          Час ▶
        </span>
        <span
          className={classNames("center-button")}
          onClick={() => onHoroscopeButtonClicked("daily", 1)}
        >
          День ▶
        </span>
        <span
          className={classNames("center-button")}
          onClick={() => onHoroscopeButtonClicked("monthly", 1)}
        >
          Мес ▶
        </span>
        <span
          className={classNames("center-button")}
          onClick={() => onHoroscopeButtonClicked("yearly", 1)}
        >
          Год ▶
        </span>
        <span
          className={classNames("center-button")}
          onClick={() => onHoroscopeButtonClicked("yearly", 10)}
        >
          Дек ▶
        </span>
      </div>
      <a
        className="iztro-copyright"
        href="https://github.com/sylarlong/iztro"
        target="_blank"
        rel="noreferrer"
      >
      </a>
    </div>
  );
};
