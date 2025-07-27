// American Democratic Party

const app = {

   article: {
      setupPage() {
         // <header>
         //    <div id=article-nav>
         //       <i data-icon=circle-left>
         //       <i data-icon=circle-right>
         //       <ul>
         //          <li><a>
         // <main>
         //    <section>
         //       <footer>
         const container = globalThis.document.getElementById('article-nav');
         const nav =       { prev: container.children[0], next: container.children[1] };
         const articles =  [...container.querySelectorAll('ul >li >a')];
         const header =    'main >section:first-child >h2';
         const title =     globalThis.document.querySelector(header).textContent;
         const index =     articles.findIndex(article => article.textContent === title);
         const configure = (button, index, leadingText) => {
            button.setAttribute('data-href', articles[index]?.getAttribute('href'));
            button.setAttribute('title',     `${leadingText} "${articles[index]?.textContent}"`);
            button.classList.add(index > -1 && index < articles.length ? 'show' : 'hide');
            };
         configure(nav.prev, index - 1, 'View');
         configure(nav.next, index + 1, 'Press ENTER to view');
         container.classList.add('show');
         const iconBar = globalThis.document.querySelector('section >footer');
         iconBar.setAttribute('title', 'Press ENTER to view the next article.');
         if (nav.next.classList.contains('show'))
            dna.dom.onEnterKey(() => nav.next.click());                       //jump to next article
         dna.dom.on('keyup', () => articles[0].click(), { keyFilter: '1' });  //jump to first article
         },
      init() {
         const hasArticleTitle = /\/article\/./;
         if (hasArticleTitle.test(globalThis.location.href))
            app.article.setupPage();
         },
      },

   platform: {
      openSection(elem, event) {
         const id = event.target.href.split('#').pop();
         const open = (elem) => {
            if (elem?.tagName.toLowerCase() === 'details')
               elem.setAttribute('open', true);
            return elem ? open(elem.parentElement) : null;
            };
         open(globalThis.document.getElementById(id));
         },
      },

   start() {
      console.info('🇺🇸 American Democratic Party 🇺🇸');
      app.article.init();
      },

   };

dna.dom.onReady(app.start);
