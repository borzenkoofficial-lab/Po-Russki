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

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeService, setActiveService] = useState(0);
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
            <div className="stage-label label-a">01 / DEMOLITION</div>
            <div className="stage-label label-b">MATERIAL / CONCRETE</div>
            <div className="concrete-object">
              <div className="block block-a" />
              <div className="block block-b" />
              <div className="block block-c" />
              <div className="cutout" />
            </div>
            <div className="stage-note">
              <span>ОБЪЕКТ</span>
              <strong>01—04</strong>
              <small>пространство<br />до следующего этапа</small>
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
              <p>Сайт будет развиваться вместе с работой: сначала заявки и портфолио, дальше — расчёты, объекты и собственная система управления.</p>
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

            <article className="service-detail reveal">
              <div className="detail-top">
                <span>0{activeService + 1}</span>
                <ArrowUpRight size={22} />
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
            <article className="work-card work-card-large reveal">
              <div className="work-visual visual-one">
                <div className="visual-lines" />
                <span>COMING SOON</span>
              </div>
              <div className="work-meta"><span>01 / КОММЕРЦИЯ</span><strong>ДЕМОНТАЖ</strong></div>
            </article>
            <article className="work-card reveal">
              <div className="work-visual visual-two"><span>REAL OBJECTS</span></div>
              <div className="work-meta"><span>02 / ОФИС</span><strong>ПОДГОТОВКА</strong></div>
            </article>
            <article className="work-card reveal">
              <div className="work-visual visual-three"><span>YOUR PROJECT</span></div>
              <div className="work-meta"><span>03 / ФАЛЬШПОЛ</span><strong>МОНТАЖ</strong></div>
            </article>
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

      <footer className="footer">
        <div className="brand"><span>ПО</span><span>РУССКИ</span></div>
        <div className="footer-copy">ДЕМОНТАЖ · ПОДГОТОВКА · ОТДЕЛКА · ФАЛЬШПОЛ</div>
        <div>МОСКВА / МО © 2026</div>
      </footer>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);