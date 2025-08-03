import React, { useEffect, useMemo, useState } from "react";
import { Izpalace } from "../Izpalace/Izpalace";
import { IztrolabeProps } from "./Iztrolabe.type";
import { IzpalaceCenter } from "../IzpalaceCenter";
import classNames from "classnames";
import { useIztro } from "iztro-hook";
import "./Iztrolabe.css";
import "../theme/default.css";
import { Scope } from "iztro/lib/data/types";
import { HeavenlyStemKey } from "iztro/lib/i18n";
import { getPalaceNames } from "iztro/lib/astro";

/**
 * Компонент визуализации астролябии. Принимает параметры рождения и
 * отображает двенадцать дворцов и центр с дополнительной информацией.
 */
export const Iztrolabe: React.FC<IztrolabeProps> = (props) => {
  // Точка соединения для отображения Тай-цзи
  const [taichiPoint, setTaichiPoint] = useState(-1);
  const [taichiPalaces, setTaichiPalaces] = useState<undefined | string[]>();
  // Управление выделением небесных стволов
  const [activeHeavenlyStem, setActiveHeavenlyStem] =
    useState<HeavenlyStemKey>();
  const [hoverHeavenlyStem, setHoverHeavenlyStem] = useState<
    HeavenlyStemKey
  >();
  // Индекс текущего наведённого дворца
  const [focusedIndex, setFocusedIndex] = useState<number>();
  // Управление видимостью различных временных диапазонов
  const [showDecadal, setShowDecadal] = useState(false);
  const [showYearly, setShowYearly] = useState(false);
  const [showMonthly, setShowMonthly] = useState(false);
  const [showDaily, setShowDaily] = useState(false);
  // Исправлено имя сеттера: теперь setShowHourly
  const [showHourly, setShowHourly] = useState(false);
  // Параметры для выборки гороскопа
  const [horoscopeDate, setHoroscopeDate] = useState<string | Date>();
  const [horoscopeHour, setHoroscopeHour] = useState<number>();
  // Получаем данные астролябии с помощью хука
  const { astrolabe, horoscope, setHoroscope } = useIztro({
    birthday: props.birthday,
    birthTime: props.birthTime,
    gender: props.gender,
    birthdayType: props.birthdayType,
    fixLeap: props.fixLeap,
    isLeapMonth: props.isLeapMonth,
    lang: props.lang,
    astroType: props.astroType,
    options: props.options,
  });

  /**
   * Переключение видимости указателя временных диапазонов.
   */
  const toggleShowScope = (scope: Scope) => {
    switch (scope) {
      case "decadal":
        setShowDecadal(!showDecadal);
        break;
      case "yearly":
        setShowYearly(!showYearly);
        break;
      case "monthly":
        setShowMonthly(!showMonthly);
        break;
      case "daily":
        setShowDaily(!showDaily);
        break;
      case "hourly":
        // Используем правильный сеттер для часов
        setShowHourly(!showHourly);
        break;
    }
  };

  /**
   * Переключение активного небесного ствола.
   */
  const toggleActiveHeavenlyStem = (heavenlyStem: HeavenlyStemKey) => {
    if (heavenlyStem === activeHeavenlyStem) {
      setActiveHeavenlyStem(undefined);
    } else {
      setActiveHeavenlyStem(heavenlyStem);
    }
  };

  /**
   * Динамические параметры для стрелки, определяемой на основе выбранного
   * временного диапазона.
   */
  const dynamic = useMemo(() => {
    if (showHourly) {
      return {
        arrowIndex: horoscope?.hourly.index,
        arrowScope: "hourly" as Scope,
      };
    }
    if (showDaily) {
      return {
        arrowIndex: horoscope?.daily.index,
        arrowScope: "daily" as Scope,
      };
    }
    if (showMonthly) {
      return {
        arrowIndex: horoscope?.monthly.index,
        arrowScope: "monthly" as Scope,
      };
    }
    if (showYearly) {
      return {
        arrowIndex: horoscope?.yearly.index,
        arrowScope: "yearly" as Scope,
      };
    }
    if (showDecadal) {
      return {
        arrowIndex: horoscope?.decadal.index,
        arrowScope: "decadal" as Scope,
      };
    }
  }, [showDecadal, showYearly, showMonthly, showDaily, showHourly, horoscope]);

  /**
   * Инициализация даты и часа гороскопа при изменении соответствующих свойств.
   */
  useEffect(() => {
    setHoroscopeDate(props.horoscopeDate ?? new Date());
    setHoroscopeHour(props.horoscopeHour ?? 0);
  }, [props.horoscopeDate, props.horoscopeHour]);

  /**
   * При изменении даты или времени обновляем гороскоп в хранилище.
   */
  useEffect(() => {
    setHoroscope(horoscopeDate ?? new Date(), horoscopeHour);
  }, [horoscopeDate, horoscopeHour]);

  /**
   * Определяем названия дворцов для Тай-цзи, когда точка выбирается или снимается.
   */
  useEffect(() => {
    if (taichiPoint < 0) {
      setTaichiPalaces(undefined);
    } else {
      const palaces = getPalaceNames(taichiPoint);
      setTaichiPalaces(palaces);
    }
  }, [taichiPoint]);

  /**
   * Переключение Тай-цзи: повторное нажатие снимает выбор.
   */
  const toggleTaichiPoint = (index: number) => {
    if (taichiPoint === index) {
      setTaichiPoint(-1);
    } else {
      setTaichiPoint(index);
    }
  };

  return (
    <div
      className={classNames(
        "iztro-astrolabe",
        "iztro-astrolabe-theme-default"
      )}
    >
      {/* Отображаем двенадцать дворцов */}
      {astrolabe?.palaces.map((palace) => {
        return (
          <Izpalace
            key={palace.earthlyBranch}
            focusedIndex={focusedIndex}
            onFocused={setFocusedIndex}
            horoscope={horoscope}
            showDecadalScope={showDecadal}
            showYearlyScope={showYearly}
            showMonthlyScope={showMonthly}
            showDailyScope={showDaily}
            showHourlyScope={showHourly}
            taichiPalace={taichiPalaces?.[palace.index]}
            toggleScope={toggleShowScope}
            activeHeavenlyStem={activeHeavenlyStem}
            toggleActiveHeavenlyStem={toggleActiveHeavenlyStem}
            hoverHeavenlyStem={hoverHeavenlyStem}
            setHoverHeavenlyStem={setHoverHeavenlyStem}
            toggleTaichiPoint={toggleTaichiPoint}
            {...palace}
          />
        );
      })}
      {/* Центральный дворец и доп. информация */}
      <IzpalaceCenter
        astrolabe={astrolabe}
        horoscope={horoscope}
        horoscopeDate={horoscopeDate}
        horoscopeHour={horoscopeHour}
        setHoroscopeDate={setHoroscopeDate}
        setHoroscopeHour={setHoroscopeHour}
        centerPalaceAlign={props.centerPalaceAlign}
        {...dynamic}
      />
    </div>
  );
};
