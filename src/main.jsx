import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowDownRight,
  ArrowUpRight,
  Check,
  ChevronRight,
  Menu,
  MoveUpRight,
  X,
} from "lucide-react";
import "./styles.css";
import Scene3D from "./Scene3D";

class SafeScene extends React.Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
  }

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error) {
    console.error("Po-Russki 3D scene failed:", error);
  }

  render() {
    if (this.state.failed) {
      return (
        <div className="scene3d-fallback safe-fallback" aria-hidden="true">
          <div className="fallback-plane" />
          <div className="fallback-wall" />
          <div className="fallback-cut" />
        </div>
      );
    }

    return this.props.children;
  }
}

const services = [
  {
    id: "01",
    title: "Демонтаж",
    kicker: "Разобрать до основания",
    text: "Стены, перегородки, полы, потолки, плитка, двери и всё, что мешает следующему этапу.",
    tags: ["Стены", "Полы", "Потолки", "Плитка"],
  },
  {
    id: "02",
    title: "Подготовка",
    kicker: "Чистое поле для работы",
    text: "Освобождаем помещение, вывозим строительный мусор и подготавливаем объект к новым работам.",
    tags: ["Разбор", "Погрузка", "Вывоз", "Уборка"],
  },
  {
    id: "03",
    title: "Отделка",
    kicker: "Сделать нормально",
    text: "Черновая и подготовительная отделка: основания, стены, потолки и поверхности под следующий этап.",
    tags: ["Штукатурка", "Шпаклёвка", "Малярка", "Основания"],
  },
  {
    id: "04",
    title: "Фальшпол",
    kicker: "Собрать рабочее пространство",
    text: "Демонтаж и монтаж фальшпола, подготовка основания и работа с пространством под покрытием.",
    tags: ["Демонтаж", "Монтаж", "Основание", "Сервис"],
  },
];

const steps = [
  ["01", "Показываете объект", "Фото, адрес и короткое описание задачи."],
  ["02", "Считаем объём", "Разбираемся с площадью, материалами и условиями."],
  ["03", "Согласовываем", "Фиксируем состав работ, сроки и стоимость."],
  ["04", "Делаем", "Выходим на объект и доводим работу до результата."],
];

const cases = [
  {
    id: "01",
    type: "Коммерция",
    title: "Демонтаж помещения",
    area: "87 м²",
    duration: "6 дней",
    scope: "Перегородки · пол · потолок · вывоз",
    note: "Освобождение помещения под следующий этап работ.",
  },
  {
    id: "02",
    type: "Офис",
    title: "Подготовка основания",
    area: "142 м²",
    duration: "4 дня",
    scope: "Разбор · уборка · подготовка",
    note: "Полностью подготовленное пространство без лишних конструкций.",
  },
  {
    id: "03",
    type: "Фальшпол",
    title: "Монтаж рабочей зоны",
    area: "96 м²",
    duration: "3 дня",
    scope: "Основание · опоры · панели",
    note: "Фальшпол с доступом к инженерному пространству.",
  },
];

const catalog = [
  {
    number: "01",
    title: "Демонтаж помещений",
    items: ["Квартиры", "Офисы", "Коммерческие помещения", "Новостройки", "Помещения под реконструкцию"],
  },
  {
    number: "02",
    title: "Конструкции и поверхности",
    items: ["Перегородки", "Стяжка", "Напольные покрытия", "Потолки", "Плитка", "Двери"],
  },
  {
    number: "03",
    title: "Вывоз и подготовка",
    items: ["Разбор", "Погрузка", "Вывоз мусора", "Уборка", "Очистка основания", "Подготовка помещений"],
  },
  {
    number: "04",
    title: "Отделка и фальшпол",
    items: ["Черновая отделка", "Штукатурка", "Шпаклёвка", "Малярные работы", "Монтаж фальшпола", "Демонтаж фальшпола"],
  },
];

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeService, setActiveService] = useState(0);
  const [activeCase, setActiveCase] = useState(null);
  const cursor = useRef(null);

  useEffect(() => {
    const move = (event) => {
      if (!cursor.current) return;
      cursor.current.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
    };
    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, []);

  useEffect(() => {
    const reveal = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add("is-visible")),
      { threshold: 0.12 }
    );
    document.querySelectorAll(".reveal").forEach((el) => reveal.observe(el));
    return () => reveal.disconnect();
  }, []);

  const scrollTo = (id) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="site-shell">
      <div className="cursor-orb" ref={cursor} />

      <header className="topbar">
        <button className="brand" onClick={() => scrollTo("top")} aria-label="На главную">
          <span>ПО</span>
          <span>РУССКИ</span>
        </button>

        <nav className={menuOpen ? "nav nav-open" : "nav"}>
          <button onClick={() => scrollTo("services")}>Услуги</button>
          <button onClick={() => scrollTo("work")}>Работы</button>
          <button onClick={() => scrollTo("process")}>Как работаем</button>
          <button onClick={() => scrollTo("contact")}>Контакты</button>
        </nav>

        <button className="menu-button" onClick={() => setMenuOpen((value) => !value)} aria-label="Меню">
          {menuOpen ? <X size={21} /> : <Menu size={21} />}
        </button>

        <button className="top-action" onClick={() => scrollTo("contact")}>
          Рассчитать работу <ArrowUpRight size={16} />
        </button>
      </header>

      <main id="top">
        <div className="scroll-meter" aria-hidden="true">
          <span />
          <strong>SCROLL</strong>
        </div>

        <section className="hero">
          <div className="hero-copy reveal">
            <p className="eyebrow"><span /> МОСКВА / МО · РАБОТАЕМ ПО ОБЪЕКТУ</p>
            <h1>
              ДЕЛАЕМ
              <br />
              <em>ПО-РУССКИ.</em>
            </h1>
            <p className="hero-description">
              Демонтаж. Подготовка. Отделка. Фальшпол.
              <br />
              Без лишнего шума — с понятным результатом.
            </p>
            <div className="hero-actions">
              <button className="button button-dark" onClick={() => scrollTo("contact")}>
                Обсудить объект <ArrowUpRight size={18} />
              </button>
              <button className="text-button" onClick={() => scrollTo("services")}>
                Смотреть услуги <ArrowDownRight size={18} />
              </button>
            </div>
          </div>

          <div className="hero-stage reveal">
            <div className="stage-grid" />
            <div className="stage-ruler ruler-top">01—100 / ММ</div>
            <div className="stage-ruler ruler-side">STRUCTURE / 01</div>
            <div className="stage-cross cross-one" />
            <div className="stage-cross cross-two" />
            <div className="blueprint-ring ring-one" />
            <div className="blueprint-ring ring-two" />
            <div className="stage-label label-a">01 / DEMOLITION</div>
            <div className="stage-label label-b">MATERIAL / CONCRETE</div>
            <SafeScene><Scene3D /></SafeScene>
            <div className="dust dust-one" />
            <div className="dust dust-two" />
            <div className="stage-center-label">
              <span>ПОКАЗЫВАЕМ</span>
              <strong>СУТЬ</strong>
              <small>пространство<br />после демонтажа</small>
            </div>
            <div className="stage-note">
              <span>НАПРАВЛЕНИЙ</span>
              <strong>04</strong>
              <small>демонтаж / подготовка<br />отделка / фальшпол</small>
            </div>
            <div className="stage-bottom-line">
              <span>ПО-РУССКИ / 2026</span>
              <span>SCROLL TO ENTER</span>
            </div>
          </div>
        </section>

        <section className="ticker" aria-label="Направления">
          <div className="ticker-track">
            {["ДЕМОНТАЖ", "ПОДГОТОВКА", "ОТДЕЛКА", "ФАЛЬШПОЛ", "ВЫВОЗ", "ДЕМОНТАЖ", "ПОДГОТОВКА", "ОТДЕЛКА"].map((item, i) => (
              <span key={i}>{item}<b>✳</b></span>
            ))}
          </div>
        </section>

        <section className="intro section-pad reveal">
          <div className="section-index">01 / О НАС</div>
          <div className="intro-content">
            <h2>Не обещаем<br /><span>лишнего.</span></h2>
            <div>
              <p className="lead">Берём объект, разбираемся в задаче и делаем работу руками. От первого демонтажа до помещения, готового к следующему этапу.</p>
              <p>Показываете задачу — мы разбираемся в объёме работ, условиях объекта и предлагаем понятный следующий шаг.</p>
            </div>
          </div>
        </section>

        <section className="service-marquee" aria-label="Работы">
          <div className="service-marquee-line"><span>СТЕНЫ</span><span>ПЕРЕГОРОДКИ</span><span>ПОЛЫ</span><span>ПОТОЛКИ</span><span>ПЛИТКА</span><span>ДВЕРИ</span><span>ФАЛЬШПОЛ</span></div>
          <div className="service-marquee-line service-marquee-reverse"><span>БЕТОН</span><span>КИРПИЧ</span><span>СТЯЖКА</span><span>ГКЛ</span><span>ДЕРЕВО</span><span>МУСОР</span><span>ПОДГОТОВКА</span></div>
        </section>

        <section className="service-sequence">
          <div className="sequence-head">
            <div className="section-index">02A / СЦЕНА</div>
            <p>Каждая задача начинается с освобождения пространства.</p>
          </div>
          <div className="sequence-grid">
            <div className="sequence-sticky">
              <div className="sequence-object">
                <div className="seq-plane seq-plane-back" />
                <div className="seq-plane seq-plane-floor" />
                <div className="seq-plane seq-plane-left" />
                <div className="seq-plane seq-plane-right" />
                <div className="seq-beam" />
                <div className="seq-cut" />
              </div>
              <div className="sequence-caption"><span>SPATIAL STUDY</span><strong>01—04</strong></div>
            </div>
            <div className="sequence-list">
              <article className="sequence-item">
                <span>01</span><h3>Разобрать</h3><p>Убираем существующие конструкции, покрытия и всё, что должно уйти.</p>
              </article>
              <article className="sequence-item">
                <span>02</span><h3>Очистить</h3><p>Освобождаем помещение, сортируем, грузим и организуем вывоз.</p>
              </article>
              <article className="sequence-item">
                <span>03</span><h3>Подготовить</h3><p>Приводим основания и пространство в состояние для следующего этапа.</p>
              </article>
              <article className="sequence-item">
                <span>04</span><h3>Собрать</h3><p>Отделка, фальшпол и новые элементы появляются уже на чистом поле.</p>
              </article>
            </div>
          </div>
        </section>

        <section className="services section-pad" id="services">
          <div className="section-heading reveal">
            <div>
              <div className="section-index">02 / УСЛУГИ</div>
              <h2>Что <span>делаем.</span></h2>
            </div>
            <p>От жёсткого демонтажа до аккуратной подготовки пространства.</p>
          </div>

          <div className="catalog-grid reveal">
            {catalog.map((group) => (
              <article className="catalog-card" key={group.number}>
                <div className="catalog-number">{group.number}</div>
                <h3>{group.title}</h3>
                <div className="catalog-items">
                  {group.items.map((item) => (
                    <span key={item}><i />{item}</span>
                  ))}
                </div>
              </article>
            ))}
          </div>

          <div className="catalog-note reveal">
            <span>СОСТАВ РАБОТ</span>
            <p>Финальный перечень зависит от объекта. Можно прислать фотографии, площадь и короткое описание — составим конкретный объём.</p>
          </div>

          <div className="service-layout">
            <div className="service-list reveal">
              {services.map((service, index) => (
                <button
                  key={service.id}
                  className={activeService === index ? "service-row active" : "service-row"}
                  onMouseEnter={() => setActiveService(index)}
                  onClick={() => setActiveService(index)}
                >
                  <span>{service.id}</span>
                  <strong>{service.title}</strong>
                  <ChevronRight size={22} />
                </button>
              ))}
            </div>

            <article className={`service-detail reveal service-detail-${activeService + 1}`}>
              <div className="detail-top">
                <span>0{activeService + 1} / SYSTEM</span>
                <ArrowUpRight size={22} />
              </div>
              <div className="service-orbit" aria-hidden="true">
                <span className="orbit-core" />
                <span className="orbit-ring orbit-ring-a" />
                <span className="orbit-ring orbit-ring-b" />
              </div>
              <div>
                <p className="eyebrow">{services[activeService].kicker}</p>
                <h3>{services[activeService].title}</h3>
                <p>{services[activeService].text}</p>
              </div>
              <div className="tag-list">
                {services[activeService].tags.map((tag) => <span key={tag}>{tag}</span>)}
              </div>
            </article>
          </div>
        </section>

        <section className="work section-pad" id="work">
          <div className="section-heading reveal">
            <div>
              <div className="section-index">03 / РАБОТЫ</div>
              <h2>Объект — это<br /><span>результат.</span></h2>
            </div>
            <p>Здесь появятся реальные объекты: площадь, задача, сроки и фотографии до / после.</p>
          </div>

          <div className="work-grid">
            {cases.map((item, index) => (
              <button
                className={index === 0 ? "work-card work-card-large reveal case-card" : "work-card reveal case-card"}
                key={item.id}
                onClick={() => setActiveCase(item)}
              >
                <span className="case-hit">ОТКРЫТЬ КЕЙС <MoveUpRight size={14} /></span>
                <div className={`work-visual visual-${index === 0 ? "one" : index === 1 ? "two" : "three"}`}>
                  <div className={index === 0 ? "visual-scan" : index === 1 ? "visual-floor" : "visual-deck"} />
                  <div className={index === 0 ? "visual-lines" : index === 1 ? "visual-pillar" : "visual-leg"} />
                  <span>CASE / {item.id}</span>
                </div>
                <div className="work-meta">
                  <span>{item.id} / {item.type.toUpperCase()}</span>
                  <strong>{item.title.toUpperCase()}</strong>
                </div>
              </button>
            ))}
          </div>
        </section>

        <section className="manifesto">
          <div className="manifesto-word">РАЗОБРАТЬ</div>
          <div className="manifesto-word">ПОДГОТОВИТЬ</div>
          <div className="manifesto-word">СДЕЛАТЬ</div>
        </section>

        <section className="statement-section">
          <div className="statement-side">ПО-РУССКИ / PRINCIPLE</div>
          <div className="statement-main">
            <p className="statement-label">Работаем не вокруг ремонта — работаем вокруг задачи.</p>
            <h2>Сначала убираем<br /><span>лишнее.</span></h2>
            <div className="statement-rule" />
            <p className="statement-copy">Освобождаем пространство, сохраняем то, что нужно сохранить, и передаём объект следующему этапу без лишней суеты.</p>
          </div>
        </section>

        <section className="process section-pad" id="process">
          <div className="section-heading reveal">
            <div>
              <div className="section-index">04 / ПРОЦЕСС</div>
              <h2>Четыре шага.<br /><span>Без бардака.</span></h2>
            </div>
          </div>
          <div className="steps">
            {steps.map(([number, title, text]) => (
              <div className="step reveal" key={number}>
                <span>{number}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="cta section-pad reveal" id="contact">
          <div className="cta-grid">
            <div>
              <div className="section-index">05 / ОБЪЕКТ</div>
              <h2>Есть работа?<br /><span>Показывайте.</span></h2>
            </div>
            <div className="cta-form">
              <label>Коротко о задаче</label>
              <textarea placeholder="Что нужно демонтировать / сделать, площадь, район..." />
              <div className="form-row">
                <input placeholder="Ваш телефон" />
                <button className="button button-light">Отправить заявку <ArrowUpRight size={18} /></button>
              </div>
              <div className="form-note"><Check size={15} /> Ответим после просмотра задачи и материалов.</div>
            </div>
          </div>
        </section>
      </main>

      {activeCase && (
        <div className="case-modal" role="dialog" aria-modal="true" aria-label={activeCase.title} onClick={() => setActiveCase(null)}>
          <div className="case-modal-inner" onClick={(event) => event.stopPropagation()}>
            <button className="case-close" onClick={() => setActiveCase(null)} aria-label="Закрыть"><X size={20} /></button>
            <div className="case-modal-visual">
              <div className="modal-before">
                <span>ДО</span>
                <div className="modal-photo-placeholder">ВСТАВИТЬ ФОТО</div>
              </div>
              <div className="modal-after">
                <span>ПОСЛЕ</span>
                <div className="modal-photo-placeholder">ВСТАВИТЬ ФОТО</div>
              </div>
            </div>
            <div className="case-modal-copy">
              <div className="section-index">{activeCase.id} / {activeCase.type.toUpperCase()}</div>
              <h2>{activeCase.title}</h2>
              <p>{activeCase.note}</p>
              <div className="case-stats">
                <div><span>Площадь</span><strong>{activeCase.area}</strong></div>
                <div><span>Срок</span><strong>{activeCase.duration}</strong></div>
                <div><span>Состав</span><strong>{activeCase.scope}</strong></div>
              </div>
              <button className="button button-dark" onClick={() => { setActiveCase(null); scrollTo("contact"); }}>
                Обсудить похожий объект <ArrowUpRight size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="floating-call" onClick={() => scrollTo("contact")}>
        <span>+</span>
        <strong>ОБЪЕКТ</strong>
      </div>

      <footer className="footer">
        <div className="brand"><span>ПО</span><span>РУССКИ</span></div>
        <div className="footer-copy">ДЕМОНТАЖ · ПОДГОТОВКА · ОТДЕЛКА · ФАЛЬШПОЛ</div>
        <div>МОСКВА / МО © 2026</div>
      </footer>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);