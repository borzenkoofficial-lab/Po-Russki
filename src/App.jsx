import React, { Component, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { ArrowDownRight, ArrowRight, ArrowUpRight, Check, Menu, X } from "lucide-react";
import Scene3D from "./Scene3D";
import "./styles.css";

const services = [
  { slug:"demontazh", number:"01", title:"Демонтаж", short:"Разбираем пространство до основания.", items:["Перегородки","Стяжка","Напольные покрытия","Потолки","Плитка","Двери","Помещения","Конструкции"] },
  { slug:"podgotovka", number:"02", title:"Подготовка", short:"Очищаем объект и готовим к следующему этапу.", items:["Разбор","Погрузка","Вывоз","Уборка","Очистка основания","Подготовка помещений"] },
  { slug:"otdelka", number:"03", title:"Отделка", short:"Черновые и подготовительные работы без лишнего.", items:["Штукатурка","Шпаклёвка","Малярные работы","Основания","Подготовка стен","Подготовка потолков"] },
  { slug:"falshpol", number:"04", title:"Фальшпол", short:"Монтаж и демонтаж фальшпола с доступом к инженерному пространству.", items:["Монтаж","Демонтаж","Опоры","Панели","Основание","Инженерное пространство"] },
];

const cases = [
  { id:"01", type:"Коммерция", title:"Демонтаж помещения", area:"87 м²", duration:"6 дней", scope:"Перегородки · пол · потолок · вывоз" },
  { id:"02", type:"Офис", title:"Подготовка основания", area:"142 м²", duration:"4 дня", scope:"Разбор · уборка · подготовка" },
  { id:"03", type:"Фальшпол", title:"Монтаж рабочей зоны", area:"96 м²", duration:"3 дня", scope:"Основание · опоры · панели" },
];

const routeNames = {"/":"Главная","/uslugi":"Услуги","/raboty":"Работы","/o-nas":"О нас","/kontakty":"Контакты"};

function routeTo() {
  const path = window.location.pathname.replace(/\/$/, "") || "/";
  return path;
}

function navigate(path) {
  window.history.pushState({}, "", path);
  window.dispatchEvent(new PopStateEvent("popstate"));
}

function LinkButton({ to, children, className="", onClick }) {
  return <button className={className} type="button" onClick={() => { onClick?.(); navigate(to); }}>{children}</button>;
}

function SafeScene({ children }) {
  return children;
}

class SceneBoundary extends Component {
  state = { failed:false };
  static getDerivedStateFromError() { return { failed:true }; }
  componentDidCatch(error) { console.error("Po-Russki 3D scene failed:", error); }
  render() {
    return this.state.failed ? <div className="scene3d-fallback safe-fallback" aria-hidden="true"><div className="fallback-plane"/><div className="fallback-wall"/><div className="fallback-cut"/></div> : this.props.children;
  }
}

function Header({ path }) {
  const [open,setOpen] = useState(false);
  const links = [["/uslugi","Услуги"],["/raboty","Работы"],["/o-nas","О нас"],["/kontakty","Контакты"]];
  return <header className="topbar site-nav">
    <LinkButton to="/" className="brand"><span>ПО</span><span>РУССКИ</span></LinkButton>
    <nav className={open ? "nav nav-open" : "nav"}>
      {links.map(([to,label]) => <LinkButton key={to} to={to} onClick={()=>setOpen(false)} className={path===to || (to==="/uslugi" && path.startsWith("/uslugi/")) ? "nav-active" : ""}>{label}</LinkButton>)}
    </nav>
    <button className="menu-button" type="button" onClick={()=>setOpen(v=>!v)} aria-label="Меню">{open ? <X size={21}/> : <Menu size={21}/>}</button>
    <LinkButton to="/kontakty" className="top-action">Обсудить объект <ArrowUpRight size={16}/></LinkButton>
  </header>;
}

function Footer() {
  return <footer className="footer site-footer">
    <LinkButton to="/" className="brand"><span>ПО</span><span>РУССКИ</span></LinkButton>
    <div className="footer-copy">ДЕМОНТАЖ · ПОДГОТОВКА · ОТДЕЛКА · ФАЛЬШПОЛ</div>
    <div>МОСКВА / МО © 2026</div>
  </footer>;
}

function PageFrame({ eyebrow, title, text, children }) {
  return <main className="inner-page">
    <section className="page-hero">
      <div className="page-hero-top"><span className="section-index">{eyebrow}</span><span className="page-code">PO-RUSSKI / 2026</span></div>
      <h1>{title}</h1>
      <p>{text}</p>
    </section>
    {children}
  </main>;
}

function HomePage() {
  const [ready,setReady] = useState(false);
  useEffect(()=>{ const t=window.setTimeout(()=>setReady(true),900); return ()=>window.clearTimeout(t); },[]);
  return <main className="home-page">
    {!ready && <div className="site-preloader"><div className="preloader-top"><span>ПО-РУССКИ</span><span>МОСКВА / МО</span></div><div className="preloader-center"><div className="preloader-line"/><strong>01</strong><span>ЗАГРУЖАЕМ ПРОСТРАНСТВО</span></div><div className="preloader-bottom"><span>DEMOLITION / PREPARATION / FINISH / ACCESS FLOOR</span><span>2026</span></div></div>}
    <section className="hero-page">
      <div className="hero-page-copy">
        <p className="eyebrow"><span/> МОСКВА / МО · РАБОТАЕМ ПО ОБЪЕКТУ</p>
        <h1>ДЕЛАЕМ<br/><em>ПО-РУССКИ.</em></h1>
        <div className="hero-service-tags">{services.map(s=><span key={s.slug}>{s.title.toUpperCase()}</span>)}</div>
        <p className="hero-description">Демонтаж, подготовка, отделка и фальшпол. Разбираемся в задаче и приводим объект к следующему этапу.</p>
        <div className="hero-actions"><LinkButton to="/kontakty" className="button button-dark">Обсудить объект <ArrowUpRight size={18}/></LinkButton><LinkButton to="/uslugi" className="text-button">Все услуги <ArrowDownRight size={18}/></LinkButton></div>
      </div>
      <div className="hero-stage">
        <div className="stage-label label-a">01 / DEMOLITION</div><div className="stage-label label-b">MATERIAL / CONCRETE</div>
        <SceneBoundary><SafeScene><Scene3D/></SafeScene></SceneBoundary>
        <div className="stage-center-label"><span>РАБОТАЕМ</span><strong>СУТЬ</strong><small>пространство<br/>до следующего этапа</small></div>
        <div className="stage-bottom-line"><span>ПО-РУССКИ / 2026</span><span>SCROLL TO ENTER</span></div>
      </div>
    </section>

    <section className="home-strip"><span>01 / НАПРАВЛЕНИЯ</span><strong>От демонтажа до нового пространства.</strong><LinkButton to="/uslugi">Смотреть услуги <ArrowRight size={16}/></LinkButton></section>

    <section className="home-intro section-pad">
      <div className="section-index">02 / ПОДХОД</div>
      <div className="home-intro-grid"><h2>Не обещаем<br/><span>лишнего.</span></h2><div><p className="lead">Берём объект, разбираемся в объёме и делаем работу руками. Без усложнений для клиента.</p><p>Состав работ формируем под конкретный объект: площадь, конструкция, условия и следующий этап.</p></div></div>
    </section>

    <section className="home-services section-pad">
      <div className="section-heading"><div><div className="section-index">03 / УСЛУГИ</div><h2>Что <span>делаем.</span></h2></div><p>Четыре основных направления и конкретный состав работ.</p></div>
      <div className="home-service-grid">{services.map(s=><button key={s.slug} className="home-service-card" onClick={()=>navigate("/uslugi/"+s.slug)}><span>{s.number}</span><h3>{s.title}</h3><p>{s.short}</p><ArrowUpRight size={19}/></button>)}</div>
    </section>

    <section className="home-cases section-pad">
      <div className="section-heading"><div><div className="section-index">04 / РАБОТЫ</div><h2>Объекты<br/><span>говорят.</span></h2></div><LinkButton to="/raboty" className="text-button">Все работы <ArrowRight size={16}/></LinkButton></div>
      <div className="home-case-grid">{cases.map((item,i)=><button className={i===0?"home-case featured":"home-case"} key={item.id} onClick={()=>navigate("/raboty")}><div className={"home-case-visual v"+(i+1)}><span>CASE / {item.id}</span><strong>{item.area}</strong></div><div className="home-case-meta"><span>{item.type.toUpperCase()}</span><strong>{item.title}</strong></div></button>)}</div>
    </section>

    <section className="home-cta section-pad"><div><div className="section-index">05 / ОБЪЕКТ</div><h2>Есть работа?<br/><span>Показывайте.</span></h2></div><div><p className="lead">Фото объекта, площадь и короткая задача — этого достаточно, чтобы начать разговор.</p><LinkButton to="/kontakty" className="button button-light">Оставить задачу <ArrowUpRight size={18}/></LinkButton></div></section>
  </main>;
}

function ServicesPage() {
  return <PageFrame eyebrow="01 / УСЛУГИ" title={<>Работы,<br/><span>которые делаем.</span></>} text="Не абстрактный ремонт. Конкретный перечень работ под объект.">
    <section className="directory-grid section-pad">{services.map(s=><article className="directory-card" key={s.slug}><div className="directory-number">{s.number}</div><div><h2>{s.title}</h2><p>{s.short}</p><div className="directory-items">{s.items.map(item=><span key={item}><i/>{item}</span>)}</div></div><LinkButton to={"/uslugi/"+s.slug} className="directory-link">Открыть направление <ArrowUpRight size={17}/></LinkButton></article>)}</section>
  </PageFrame>;
}

function ServicePage({ service }) {
  return <PageFrame eyebrow={service.number+" / "+service.title.toUpperCase()} title={<><span>{service.title}</span><br/>под задачу.</>} text={service.short}>
    <section className="service-detail-page section-pad">
      <div className="service-detail-visual"><div className="detail-grid"/><div className="detail-mark"><span>{service.number}</span><strong>{service.title.slice(0,1)}</strong></div><div className="detail-tech">PO-RUSSKI / FIELD STUDY / {service.number}</div></div>
      <div className="service-detail-copy"><span className="section-index">СОСТАВ РАБОТ</span><h2>{service.title}</h2><p className="lead">{service.short}</p><div className="service-long-copy"><p>Состав работ определяем по фактическому состоянию объекта. При необходимости работаем по фото и видео, после чего фиксируем объём на объекте.</p><p>Дальше согласовываем последовательность, сроки и что должно остаться в помещении после выполнения.</p></div><div className="directory-items">{service.items.map(i=><span key={i}><i/>{i}</span>)}</div><LinkButton to="/kontakty" className="button button-dark">Обсудить {service.title.toLowerCase()} <ArrowUpRight size={18}/></LinkButton></div>
    </section>
  </PageFrame>;
}

function WorksPage() {
  return <PageFrame eyebrow="02 / РАБОТЫ" title={<>Не слова.<br/><span>Объекты.</span></>} text="Здесь будут реальные фотографии, площадь, состав работ и сроки.">
    <section className="works-archive section-pad">{cases.map((item,i)=><article className="archive-case" key={item.id}><div className={"archive-visual av"+(i+1)}><span>CASE / {item.id}</span><strong>{item.area}</strong></div><div className="archive-copy"><div className="section-index">{item.id} / {item.type.toUpperCase()}</div><h2>{item.title}</h2><div className="archive-stats"><div><span>Площадь</span><strong>{item.area}</strong></div><div><span>Срок</span><strong>{item.duration}</strong></div></div><p>{item.scope}</p><LinkButton to="/kontakty" className="text-button">Обсудить похожий объект <ArrowRight size={16}/></LinkButton></div></article>)}</section>
  </PageFrame>;
}

function AboutPage() {
  return <PageFrame eyebrow="03 / О НАС" title={<>Работаем<br/><span>по делу.</span></>} text="По-русски — это про понятную работу на объекте, а не про красивую упаковку.">
    <section className="about-grid section-pad"><div className="about-big">Сначала<br/><span>убираем.</span></div><div className="about-copy"><p className="lead">Берём демонтаж, подготовку, отделку и фальшпол как отдельные рабочие задачи. Важен конечный результат помещения.</p><p>Не навязываем лишнее. Согласовываем состав работ заранее и показываем, что именно входит в задачу.</p><div className="principles"><div><span>01</span><strong>ПОНЯТНЫЙ ОБЪЁМ</strong></div><div><span>02</span><strong>РЕАЛЬНЫЕ СРОКИ</strong></div><div><span>03</span><strong>ОТВЕТСТВЕННОСТЬ ЗА РЕЗУЛЬТАТ</strong></div></div></div></section>
  </PageFrame>;
}

function ContactsPage() {
  const [kind,setKind]=useState("Демонтаж");
  return <PageFrame eyebrow="04 / КОНТАКТЫ" title={<>Есть объект?<br/><span>Показывайте.</span></>} text="Опишите задачу. Фото и видео можно прислать после первого контакта.">
    <section className="contacts-page section-pad"><div className="contact-copy"><span className="section-index">ОТВЕТИМ ПОСЛЕ ПРОСМОТРА ЗАДАЧИ</span><h2>Начнём<br/><span>с объекта.</span></h2><p className="lead">Москва и Московская область. Подберём состав работ под помещение и задачу.</p></div><form className="project-form" onSubmit={(e)=>e.preventDefault()}><label>01 / НАПРАВЛЕНИЕ</label><div className="quote-chips">{services.map(s=><button key={s.slug} type="button" className={kind===s.title?"quote-chip active":"quote-chip"} onClick={()=>setKind(s.title)}>{s.title}</button>)}</div><label className="quote-label">02 / ВВОДНЫЕ</label><div className="quote-inputs"><input placeholder="Площадь, м²"/><input placeholder="Район / адрес"/></div><label className="quote-label">03 / ЗАДАЧА</label><textarea placeholder={"Что требуется по работе «"+kind+"»..."}/><label className="quote-label">04 / ТЕЛЕФОН</label><input placeholder="Ваш телефон" inputMode="tel"/><button className="button button-light" type="submit">Отправить задачу <ArrowUpRight size={18}/></button><div className="form-note"><Check size={15}/> Можно приложить фотографии после связи.</div></form></section>
  </PageFrame>;
}

function App() {
  const [path,setPath]=useState(routeTo());
  useEffect(()=>{
    const onPop=()=>setPath(routeTo());
    window.addEventListener("popstate",onPop);
    const onClick=(event)=>{
      const target=event.target.closest?.("button[data-route]");
      if(!target) return;
    };
    return ()=>{window.removeEventListener("popstate",onPop); window.removeEventListener("click",onClick);};
  },[]);
  useEffect(()=>{ window.scrollTo(0,0); },[path]);

  let page;
  if(path==="/") page=<HomePage/>;
  else if(path==="/uslugi") page=<ServicesPage/>;
  else if(path==="/raboty") page=<WorksPage/>;
  else if(path==="/o-nas") page=<AboutPage/>;
  else if(path==="/kontakty") page=<ContactsPage/>;
  else if(path.startsWith("/uslugi/")) {
    const slug=path.split("/")[2];
    const service=services.find(s=>s.slug===slug);
    page=service?<ServicePage service={service}/>:<ServicesPage/>;
  } else page=<HomePage/>;

  return <div className="site-shell"><Header path={path}/><div key={path} className="page-transition">{page}</div><div className="floating-call" onClick={()=>navigate("/kontakty")}><span>+</span><strong>ОБЪЕКТ</strong></div><Footer/></div>;
}

createRoot(document.getElementById("root")).render(<App/>);
