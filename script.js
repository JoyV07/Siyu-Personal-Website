/* === script.js === */
/* Global behaviors: theme toggle (localStorage), nav active, accordion, todo, game */
document.addEventListener('DOMContentLoaded', () => {
  // theme
  const themeBtn = document.getElementById('themeToggle');
  const saved = localStorage.getItem('site_theme_dark');
  if(saved === '1') document.body.classList.add('dark');
  if(themeBtn){
    themeBtn.addEventListener('click', () => {
      const isDark = document.body.classList.toggle('dark');
      localStorage.setItem('site_theme_dark', isDark ? '1' : '0');
    });
  }

  // nav active highlighting
  document.querySelectorAll('.nav-links a').forEach(a => {
    if(a.href === location.href || (a.getAttribute('href') && location.pathname.endsWith(a.getAttribute('href')))){
      a.classList.add('active');
    }
  });

  // accordion for foods
  document.querySelectorAll('.acc-header').forEach(h => {
    h.addEventListener('click', () => {
      const body = h.nextElementSibling;
      // close others
      document.querySelectorAll('.acc-body').forEach(b => { if(b!==body) b.style.maxHeight = null; });
      if(body.style.maxHeight) body.style.maxHeight = null;
      else body.style.maxHeight = body.scrollHeight + 'px';
    });
  });
  // open first
  const first = document.querySelector('.acc-body');
  if(first) first.style.maxHeight = first.scrollHeight + 'px';

  /* === ToDo logic === */
  const todoInput = document.getElementById('todoInput');
  const todoBtn = document.getElementById('todoAdd');
  const todoList = document.getElementById('todoList');

  function renderTodoItem(item){
    const li = document.createElement('li');
    li.dataset.id = item.id;
    li.className = item.done ? 'done' : '';
    const chk = document.createElement('button');
    chk.innerHTML = item.done ? '✔' : '◻';
    chk.style.background = 'transparent'; chk.style.border = 'none'; chk.style.cursor='pointer'; chk.style.fontSize='18px';
    chk.addEventListener('click', () => {
      item.done = !item.done;
      saveAndRender();
    });
    const span = document.createElement('div');
    span.className='text';
    span.textContent = item.text;
    span.style.userSelect='none';
    const del = document.createElement('button');
    del.innerHTML='🗑';
    del.style.background='transparent';del.style.border='none';del.style.cursor='pointer';
    del.addEventListener('click', () => {
      todos = todos.filter(t => t.id !== item.id);
      saveAndRender();
    });
    li.appendChild(chk); li.appendChild(span); li.appendChild(del);
    if(item.done) li.classList.add('done');
    return li;
  }
  let todos = [];
  function loadTodos(){
    const raw = localStorage.getItem('my_todos_v1');
    if(raw) todos = JSON.parse(raw); else todos = [];
  }
  function saveTodos(){ localStorage.setItem('my_todos_v1', JSON.stringify(todos)); }
  function saveAndRender(){
    saveTodos();
    todoList.innerHTML='';
    todos.forEach(t => todoList.appendChild(renderTodoItem(t)));
  }
  if(todoBtn && todoInput && todoList){
    loadTodos(); saveAndRender();
    todoBtn.addEventListener('click', () => {
      const val = todoInput.value.trim();
      if(!val) return;
      todos.push({id: Date.now().toString(36), text: val, done:false});
      todoInput.value=''; saveAndRender();
    });
  }

  /* === Memory game logic === */
  const cardsContainer = document.getElementById('gameGrid');
  if(cardsContainer){
    // images for cards (make pairs)
    const imgs = [
      'images/mipi.jpeg','images/roujiamo.jpeg','images/biangbiang.jpeg','images/guantangbao.jpg',
      'images/huluji.jpeg','images/kaorou.jpeg','images/shuijingbing.jpeg','images/suantang.jpg'
    ];
    // create pairs and shuffle
    let deck = imgs.concat(imgs).slice(0,16);
    function shuffle(a){ for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];} return a;}
    deck = shuffle(deck);

    let firstCard = null,SecondCard=null, lock=false, matches=0;
    function createCard(src, idx){
      const card = document.createElement('div'); card.className='card-game'; card.dataset.src=src;
      const back = document.createElement('div'); back.className='back'; back.textContent='?';
      const front = document.createElement('div'); front.className='front';
      const img = document.createElement('img'); img.src = src; img.style.width='100%'; img.style.height='100%'; img.style.objectFit='cover';
      front.appendChild(img);
      card.appendChild(back); card.appendChild(front);
      card.addEventListener('click', () => {
        if(lock || card.classList.contains('matched') || card === firstCard) return;
        card.classList.add('flip');
        if(!firstCard) { firstCard = card; return; }
        SecondCard = card;
        lock = true;
        setTimeout(()=>{
          if(firstCard.dataset.src === SecondCard.dataset.src){
            firstCard.classList.add('matched'); SecondCard.classList.add('matched'); matches++;
            // success sound or effect could go here
            if(matches === deck.length/2){
              setTimeout(()=> alert('Congratulations — you matched all pairs!'),200);
            }
          } else {
            firstCard.classList.remove('flip'); SecondCard.classList.remove('flip');
          }
          firstCard = null; SecondCard = null; lock=false;
        },700);
      });
      return card;
    }
    // render
    cardsContainer.innerHTML = '';
    deck.forEach((src, i) => cardsContainer.appendChild(createCard(src, i)));
  }

});
