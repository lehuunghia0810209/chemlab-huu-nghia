import './virtualLab.css'

export function initVirtualLab() {
  const host = document.querySelector('#lab-host') || document.querySelector('main')
  if (!host) return
  document.querySelector('#lab')?.remove()

  const reagents = {
    water:{name:'Nước',formula:'H₂O',color:'#7ecbff',acidBase:0},
    hcl:{name:'Axit hydrochloric',formula:'HCl',color:'#dff3ff',acidBase:-1},
    h2so4:{name:'Axit sulfuric',formula:'H₂SO₄',color:'#e4f5ff',acidBase:-1.2},
    hno3:{name:'Axit nitric',formula:'HNO₃',color:'#edf8ff',acidBase:-1},
    naoh:{name:'Natri hydroxide',formula:'NaOH',color:'#e7fbff',acidBase:1},
    koh:{name:'Kali hydroxide',formula:'KOH',color:'#eefcff',acidBase:1},
    caoh2:{name:'Canxi hydroxide',formula:'Ca(OH)₂',color:'#f4fbff',acidBase:.8},
    cuso4:{name:'Đồng(II) sulfate',formula:'CuSO₄',color:'#2d8fff',acidBase:-.1},
    fecl3:{name:'Sắt(III) chloride',formula:'FeCl₃',color:'#d29a3e',acidBase:-.15},
    feso4:{name:'Sắt(II) sulfate',formula:'FeSO₄',color:'#8db487',acidBase:-.05},
    nacl:{name:'Natri chloride',formula:'NaCl',color:'#edf3fb',acidBase:0},
    agno3:{name:'Bạc nitrate',formula:'AgNO₃',color:'#f7fbff',acidBase:-.05},
    bacl2:{name:'Bari chloride',formula:'BaCl₂',color:'#edf7ff',acidBase:0},
    na2co3:{name:'Natri carbonate',formula:'Na₂CO₃',color:'#e6fbff',acidBase:.45},
    na2so4:{name:'Natri sulfate',formula:'Na₂SO₄',color:'#eef7ff',acidBase:0},
    ki:{name:'Kali iodide',formula:'KI',color:'#fff9d7',acidBase:0},
    kscn:{name:'Kali thiocyanate',formula:'KSCN',color:'#f4f8ff',acidBase:0},
    indicator:{name:'Phenolphthalein',formula:'Chỉ thị',color:'#f4cfe6',acidBase:0,indicator:true}
  }

  const reactions = [
    {needs:['hcl','naoh'],title:'Phản ứng trung hòa',equation:'HCl + NaOH → NaCl + H₂O',desc:'Axit và bazơ phản ứng tạo muối và nước.',effect:'neutral'},
    {needs:['hcl','koh'],title:'Phản ứng trung hòa',equation:'HCl + KOH → KCl + H₂O',desc:'Axit và bazơ phản ứng tạo muối và nước.',effect:'neutral'},
    {needs:['h2so4','naoh'],title:'Phản ứng trung hòa',equation:'H₂SO₄ + 2NaOH → Na₂SO₄ + 2H₂O',desc:'Axit sulfuric phản ứng với natri hydroxide.',effect:'neutral'},
    {needs:['cuso4','naoh'],title:'Xuất hiện kết tủa xanh',equation:'CuSO₄ + 2NaOH → Cu(OH)₂↓ + Na₂SO₄',desc:'Xuất hiện kết tủa Cu(OH)₂ màu xanh.',effect:'precipitate',color:'#39a9ff'},
    {needs:['fecl3','naoh'],title:'Xuất hiện kết tủa nâu đỏ',equation:'FeCl₃ + 3NaOH → Fe(OH)₃↓ + 3NaCl',desc:'Xuất hiện kết tủa Fe(OH)₃ màu nâu đỏ.',effect:'precipitate',color:'#a15431'},
    {needs:['feso4','naoh'],title:'Xuất hiện kết tủa xanh lục',equation:'FeSO₄ + 2NaOH → Fe(OH)₂↓ + Na₂SO₄',desc:'Xuất hiện kết tủa Fe(OH)₂ màu xanh lục.',effect:'precipitate',color:'#7aa66d'},
    {needs:['agno3','nacl'],title:'Xuất hiện kết tủa trắng',equation:'AgNO₃ + NaCl → AgCl↓ + NaNO₃',desc:'Xuất hiện kết tủa AgCl màu trắng.',effect:'precipitate',color:'#f5f5f5'},
    {needs:['agno3','ki'],title:'Xuất hiện kết tủa vàng',equation:'AgNO₃ + KI → AgI↓ + KNO₃',desc:'Xuất hiện kết tủa AgI màu vàng.',effect:'precipitate',color:'#efd03f'},
    {needs:['bacl2','na2so4'],title:'Xuất hiện kết tủa trắng',equation:'BaCl₂ + Na₂SO₄ → BaSO₄↓ + 2NaCl',desc:'Xuất hiện kết tủa BaSO₄ màu trắng.',effect:'precipitate',color:'#f4f4f4'},
    {needs:['na2co3','hcl'],title:'Khí CO₂ thoát ra',equation:'Na₂CO₃ + 2HCl → 2NaCl + H₂O + CO₂↑',desc:'Dung dịch sủi bọt do khí CO₂ được tạo thành.',effect:'gas'},
    {needs:['na2co3','h2so4'],title:'Khí CO₂ thoát ra',equation:'Na₂CO₃ + H₂SO₄ → Na₂SO₄ + H₂O + CO₂↑',desc:'Dung dịch sủi bọt do khí CO₂ thoát ra.',effect:'gas'},
    {needs:['fecl3','kscn'],title:'Dung dịch chuyển đỏ',equation:'Fe³⁺ + SCN⁻ ⇌ FeSCN²⁺',desc:'Dung dịch xuất hiện màu đỏ đặc trưng của phức sắt(III) thiocyanate.',effect:'solutionColor',color:'#b71d3d'}
  ]

  const chemOrder = ['water','hcl','h2so4','hno3','naoh','koh','caoh2','cuso4','fecl3','feso4','nacl','agno3','bacl2','na2co3','na2so4','ki','kscn','indicator']

  const section = document.createElement('section')
  section.id = 'lab'
  section.className = 'virtual-lab-v2'
  section.innerHTML = `
    <div class="vl-head">
      <div>
        <span>CHEMLAB V2</span>
        <h2>Phòng thí nghiệm ảo</h2>
        <p>Chọn hoặc kéo hóa chất vào cốc để quan sát phản ứng, pH và nhiệt độ theo thời gian thực.</p>
      </div>
      <div class="vl-live"><i></i><b>Đang mô phỏng</b></div>
    </div>

    <div class="vl-layout">
      <aside class="vl-shelf panel">
        <div class="panel-label">HÓA CHẤT</div>
        <h3>Kho thí nghiệm</h3>
        <div id="reagent-list" class="reagent-list"></div>
        <div class="vl-volume">
          <span>LƯỢNG THÊM</span>
          <div>
            <button data-volume="10">10 mL</button>
            <button data-volume="25" class="active">25 mL</button>
            <button data-volume="50">50 mL</button>
          </div>
        </div>
        <button id="add-reagent" class="primary-btn" disabled>+ Thêm vào cốc</button>
      </aside>

      <div class="vl-main">
        <div class="vl-stage panel" id="beaker-area">
          <div class="stage-grid"></div>

          <div class="stage-badge left"><span>THỂ TÍCH</span><strong id="lab-volume">0 mL</strong></div>
          <div class="stage-badge right"><span>TRẠNG THÁI</span><strong id="lab-state">Cốc trống</strong></div>

          <div class="beaker-scene">
            <div class="steam-layer" id="steam-layer"></div>

            <div class="beaker-wrap" id="beaker-wrap">
              <div class="beaker-body">
                <div class="beaker-top"></div>
                <div class="beaker-inner">
                  <div class="beaker-scale">
                    <span>100</span>
                    <span>75</span>
                    <span>50</span>
                    <span>25</span>
                  </div>

                  <div class="liquid-mask">
                    <div class="liquid" id="lab-liquid">
                      <div class="liquid-top"></div>
                      <div class="bubble-layer" id="bubble-layer"></div>
                      <div class="precipitate-layer" id="precipitate-layer"></div>
                    </div>
                  </div>

                  <div class="drop-layer" id="drop-layer"></div>
                </div>
              </div>
            </div>

            <div class="flame-box" id="flame-base">
              <div class="flame-outer"></div>
              <div class="flame-core"></div>
              <div class="flame-stand"></div>
            </div>

            <div class="scene-shadow"></div>
          </div>

          <div class="stage-note">
            <strong id="lab-message-title">Bắt đầu thí nghiệm</strong>
            <span id="lab-message">Chọn một hóa chất bên trái để bắt đầu.</span>
          </div>
        </div>

        <div class="vl-controls panel">
          <button id="stir-button">Khuấy</button>
          <button id="heat-button">Bật lửa</button>
          <button id="empty-button">Đổ bỏ</button>
          <button id="reset-lab">Đặt lại</button>
          <span>Kéo ngang trên cốc để nghiêng</span>
        </div>

        <div class="vl-dashboard">
          <div class="meter panel">
            <span>NHIỆT ĐỘ</span>
            <strong><b id="temperature-value">25.0</b> °C</strong>
            <div class="bar"><i id="temperature-bar"></i></div>
          </div>

          <div class="meter panel">
            <span>ĐỘ pH</span>
            <strong id="ph-value">7.0</strong>
            <div class="ph-bar"><i id="ph-marker"></i></div>
          </div>

          <div class="meter panel">
            <span>DUNG DỊCH</span>
            <strong id="solution-count">0 chất</strong>
            <small id="selected-name">Chưa chọn hóa chất</small>
          </div>
        </div>
      </div>

      <aside class="vl-side panel">
        <div class="panel-label">PHÂN TÍCH</div>
        <h3>Quan sát</h3>

        <div class="info-box">
          <span>HIỆN TƯỢNG</span>
          <strong id="observation-title">Chưa có hiện tượng</strong>
          <p id="observation-text">Thêm hóa chất vào cốc để bắt đầu mô phỏng.</p>
        </div>

        <div class="info-box">
          <span>PHƯƠNG TRÌNH</span>
          <strong id="reaction-equation">—</strong>
        </div>

        <div class="info-box">
          <span>TRONG CỐC</span>
          <div id="composition-list" class="composition-list"><p>Cốc đang trống.</p></div>
        </div>

        <div class="info-box log-box">
          <div class="log-head"><span>NHẬT KÝ</span><button id="clear-log">Xóa</button></div>
          <div id="lab-log-list" class="log-list"><p class="log-empty">Chưa có hoạt động.</p></div>
        </div>
      </aside>
    </div>
  `
  host.appendChild(section)

  const reagentList = section.querySelector('#reagent-list')
  const addButton = section.querySelector('#add-reagent')
  const liquid = section.querySelector('#lab-liquid')
  const beakerWrap = section.querySelector('#beaker-wrap')
  const beakerArea = section.querySelector('#beaker-area')
  const bubbleLayer = section.querySelector('#bubble-layer')
  const precipitateLayer = section.querySelector('#precipitate-layer')
  const dropLayer = section.querySelector('#drop-layer')
  const flameBase = section.querySelector('#flame-base')
  const steamLayer = section.querySelector('#steam-layer')
  const volumeText = section.querySelector('#lab-volume')
  const stateText = section.querySelector('#lab-state')
  const tempText = section.querySelector('#temperature-value')
  const tempBar = section.querySelector('#temperature-bar')
  const phText = section.querySelector('#ph-value')
  const phMarker = section.querySelector('#ph-marker')
  const solutionCount = section.querySelector('#solution-count')
  const selectedName = section.querySelector('#selected-name')
  const observationTitle = section.querySelector('#observation-title')
  const observationText = section.querySelector('#observation-text')
  const equationText = section.querySelector('#reaction-equation')
  const compositionList = section.querySelector('#composition-list')
  const messageTitle = section.querySelector('#lab-message-title')
  const message = section.querySelector('#lab-message')
  const logList = section.querySelector('#lab-log-list')
  const heatButton = section.querySelector('#heat-button')

  let selectedReagent = null
  let selectedVolume = 25
  let totalVolume = 0
  let temperature = 25
  let heating = false
  let mixture = {}
  let triggeredReactions = new Set()
  let precipitate = null
  let currentColor = '#7ecbff'
  let indicatorAdded = false

  let tiltCurrent = 0
  let tiltTarget = 0
  let liquidTilt = 0
  let dragging = false
  let startX = 0

  chemOrder.forEach(id => {
    const reagent = reagents[id]
    const card = document.createElement('button')
    card.className = 'reagent-card'
    card.draggable = true
    card.dataset.reagent = id
    card.innerHTML = `
      <div class="bottle" style="--c:${reagent.color}">
        <i></i><b></b>
      </div>
      <div class="reagent-text">
        <strong>${reagent.formula}</strong>
        <span>${reagent.name}</span>
      </div>
    `
    card.addEventListener('click',()=>selectReagent(id))
    card.addEventListener('dragstart',e=>{
      e.dataTransfer.setData('text/plain',id)
      selectReagent(id)
    })
    reagentList.appendChild(card)
  })

  function selectReagent(id){
    selectedReagent = id
    section.querySelectorAll('.reagent-card').forEach(card=>card.classList.toggle('active',card.dataset.reagent===id))
    addButton.disabled = false
    selectedName.textContent = reagents[id].name
    messageTitle.textContent = reagents[id].formula
    message.textContent = 'Nhấn “Thêm vào cốc” hoặc kéo hóa chất vào cốc.'
  }

  section.querySelectorAll('[data-volume]').forEach(btn=>{
    btn.addEventListener('click',()=>{
      selectedVolume = Number(btn.dataset.volume)
      section.querySelectorAll('[data-volume]').forEach(x=>x.classList.toggle('active',x===btn))
    })
  })

  addButton.addEventListener('click',()=>selectedReagent && addReagent(selectedReagent,selectedVolume))

  beakerArea.addEventListener('dragover',e=>{e.preventDefault();beakerArea.classList.add('drag-over')})
  beakerArea.addEventListener('dragleave',()=>beakerArea.classList.remove('drag-over'))
  beakerArea.addEventListener('drop',e=>{
    e.preventDefault()
    beakerArea.classList.remove('drag-over')
    const id = e.dataTransfer.getData('text/plain')
    if(reagents[id]) addReagent(id,selectedVolume)
  })

  function addReagent(id,amount){
    const reagent = reagents[id]
    const wasEmpty = totalVolume===0
    mixture[id] = (mixture[id]||0)+amount
    totalVolume = Math.min(250,totalVolume+amount)
    if(reagent.indicator) indicatorAdded = true

    animateDrop(reagent.color)
    currentColor = wasEmpty ? reagent.color : mixColors(currentColor,reagent.color)
    updateLiquid()
    checkReactions()
    updateDashboard()
    addLog(`Đã thêm ${amount} mL ${reagent.formula}.`)
    messageTitle.textContent = `Đã thêm ${reagent.formula}`
    message.textContent = `${reagent.name} đã được thêm vào cốc.`
  }

  function animateDrop(color){
    for(let i=0;i<8;i++){
      const d = document.createElement('i')
      d.style.setProperty('--drop-color',color)
      d.style.left = `${47 + Math.random()*6}%`
      d.style.animationDelay = `${i*50}ms`
      dropLayer.appendChild(d)
      setTimeout(()=>d.remove(),1000)
    }
    beakerWrap.classList.remove('receive')
    void beakerWrap.offsetWidth
    beakerWrap.classList.add('receive')
  }

  function updateLiquid(){
    const h = Math.max(0,Math.min(78,totalVolume/250*78))
    liquid.style.height = `${h}%`
    liquid.style.setProperty('--liquid-color',getDisplayedColor())
    stateText.textContent = totalVolume>0 ? 'Có dung dịch' : 'Cốc trống'
    volumeText.textContent = `${Math.round(totalVolume)} mL`
  }

  function getDisplayedColor(){
    const ph = calculatePH()
    if(indicatorAdded && ph>8.2) return '#ef4da0'
    if(indicatorAdded && ph<=8.2) return '#f2d6e5'
    return currentColor
  }

  function checkReactions(){
    reactions.forEach((r,idx)=>{
      const ok = r.needs.every(id=>mixture[id]>0)
      const key = `${idx}-${r.needs.join('-')}`
      if(!ok || triggeredReactions.has(key)) return
      triggeredReactions.add(key)

      observationTitle.textContent = r.title
      observationText.textContent = r.desc
      equationText.textContent = r.equation
      messageTitle.textContent = r.title
      message.textContent = r.equation

      if(r.effect==='neutral') flashReaction()
      if(r.effect==='precipitate'){precipitate=r.color;createPrecipitate(r.color)}
      if(r.effect==='gas') createBubbles(28)
      if(r.effect==='solutionColor'){currentColor=r.color;updateLiquid();flashReaction()}

      addLog(r.title)
      addLog(r.equation)
    })
  }

  function createBubbles(n=12){
    for(let i=0;i<n;i++){
      setTimeout(()=>{
        const b = document.createElement('i')
        b.style.left = `${8 + Math.random()*84}%`
        const s = 6 + Math.random()*8
        b.style.width = `${s}px`
        b.style.height = `${s}px`
        b.style.animationDuration = `${1.7 + Math.random()*1.2}s`
        bubbleLayer.appendChild(b)
        setTimeout(()=>b.remove(),3000)
      },i*55)
    }
  }

  function createPrecipitate(color){
    precipitateLayer.innerHTML = ''
    for(let i=0;i<40;i++){
      const p = document.createElement('i')
      p.style.left = `${4 + Math.random()*92}%`
      p.style.setProperty('--precipitate-color',color)
      p.style.animationDelay = `${Math.random()*500}ms`
      precipitateLayer.appendChild(p)
    }
  }

  function flashReaction(){
    beakerWrap.classList.remove('flash')
    void beakerWrap.offsetWidth
    beakerWrap.classList.add('flash')
  }

  function calculatePH(){
    if(!totalVolume) return 7
    let balance = 0
    Object.entries(mixture).forEach(([id,v])=>balance += reagents[id].acidBase*v)
    return clamp(7 + balance/Math.max(totalVolume,1)*6,1,13)
  }

  function updateDashboard(){
    const ph = calculatePH()
    phText.textContent = ph.toFixed(1)
    phMarker.style.left = `${ph/14*100}%`
    liquid.style.setProperty('--liquid-color',getDisplayedColor())
    const count = Object.keys(mixture).filter(id=>mixture[id]>0).length
    solutionCount.textContent = `${count} chất`
    compositionList.innerHTML = ''
    const arr = Object.entries(mixture).filter(([,v])=>v>0)
    if(!arr.length){
      compositionList.innerHTML = '<p>Cốc đang trống.</p>'
      return
    }
    arr.forEach(([id,v])=>{
      const row = document.createElement('div')
      row.innerHTML = `<span>${reagents[id].formula}</span><strong>${Math.round(v)} mL</strong>`
      compositionList.appendChild(row)
    })
  }

  function addLog(text){
    logList.querySelector('.log-empty')?.remove()
    const item = document.createElement('div')
    item.className = 'log-item'
    const t = new Date().toLocaleTimeString('vi-VN',{hour:'2-digit',minute:'2-digit',second:'2-digit'})
    item.innerHTML = `<span>${t}</span><p>${text}</p>`
    logList.prepend(item)
  }

  section.querySelector('#clear-log').addEventListener('click',()=>{
    logList.innerHTML = '<p class="log-empty">Chưa có hoạt động.</p>'
  })

  section.querySelector('#stir-button').addEventListener('click',()=>{
    if(!totalVolume){
      messageTitle.textContent = 'Cốc đang trống'
      message.textContent = 'Hãy thêm hóa chất trước khi khuấy.'
      return
    }
    beakerWrap.classList.remove('stir')
    liquid.classList.remove('swirl')
    void beakerWrap.offsetWidth
    void liquid.offsetWidth
    beakerWrap.classList.add('stir')
    liquid.classList.add('swirl')
    if(precipitate){
      precipitateLayer.classList.remove('shake')
      void precipitateLayer.offsetWidth
      precipitateLayer.classList.add('shake')
    }
    createBubbles(6)
    addLog('Đã khuấy dung dịch.')
    messageTitle.textContent = 'Đang khuấy'
    message.textContent = 'Dung dịch đang được trộn đều.'
  })

  heatButton.addEventListener('click',()=>{
    heating = !heating
    flameBase.classList.toggle('on',heating)
    heatButton.classList.toggle('active',heating)
    heatButton.textContent = heating ? 'Tắt lửa' : 'Bật lửa'
    addLog(heating ? 'Đã bật lửa.' : 'Đã tắt lửa.')
    messageTitle.textContent = heating ? 'Đang gia nhiệt' : 'Đã tắt lửa'
    message.textContent = heating ? 'Nhiệt độ dung dịch đang tăng.' : 'Dung dịch sẽ nguội dần.'
  })

  section.querySelector('#empty-button').addEventListener('click',emptyBeaker)
  section.querySelector('#reset-lab').addEventListener('click',resetLab)

  function emptyBeaker(){
    mixture = {}
    totalVolume = 0
    precipitate = null
    indicatorAdded = false
    currentColor = '#7ecbff'
    triggeredReactions.clear()
    precipitateLayer.innerHTML = ''
    bubbleLayer.innerHTML = ''
    observationTitle.textContent = 'Chưa có hiện tượng'
    observationText.textContent = 'Cốc đã được làm trống.'
    equationText.textContent = '—'
    messageTitle.textContent = 'Cốc đã trống'
    message.textContent = 'Bạn có thể bắt đầu một thí nghiệm mới.'
    updateLiquid()
    updateDashboard()
    addLog('Đã đổ bỏ dung dịch.')
  }

  function resetLab(){
    heating = false
    flameBase.classList.remove('on')
    heatButton.classList.remove('active')
    heatButton.textContent = 'Bật lửa'
    temperature = 25
    tempText.textContent = '25.0'
    tempBar.style.width = '0%'
    emptyBeaker()
    selectedReagent = null
    addButton.disabled = true
    selectedName.textContent = 'Chưa chọn hóa chất'
    section.querySelectorAll('.reagent-card').forEach(c=>c.classList.remove('active'))
    logList.innerHTML = '<p class="log-empty">Chưa có hoạt động.</p>'
    messageTitle.textContent = 'Bắt đầu thí nghiệm'
    message.textContent = 'Chọn một hóa chất bên trái để bắt đầu.'
  }

  setInterval(()=>{
    if(heating && totalVolume>0) temperature = Math.min(100,temperature + 0.2)
    else if(temperature>25) temperature = Math.max(25,temperature - 0.08)

    tempText.textContent = temperature.toFixed(1)
    tempBar.style.width = `${clamp((temperature-25)/75*100,0,100)}%`

    if(temperature>75 && totalVolume>0 && Math.random()>.72) createSteam()
  },300)

  function createSteam(){
    const s = document.createElement('i')
    s.style.left = `${48 + Math.random()*8}%`
    steamLayer.appendChild(s)
    setTimeout(()=>s.remove(),2600)
  }

  beakerWrap.addEventListener('pointerdown',e=>{
    dragging = true
    startX = e.clientX
    beakerWrap.setPointerCapture(e.pointerId)
    beakerWrap.classList.add('dragging')
  })

  beakerWrap.addEventListener('pointermove',e=>{
    if(!dragging) return
    const dx = e.clientX - startX
    tiltTarget = clamp(dx/10,-12,12)
  })

  function stopDrag(e){
    if(e?.pointerId){try{beakerWrap.releasePointerCapture(e.pointerId)}catch{}}
    dragging = false
    beakerWrap.classList.remove('dragging')
    tiltTarget = 0
  }

  beakerWrap.addEventListener('pointerup',stopDrag)
  beakerWrap.addEventListener('pointercancel',stopDrag)
  beakerWrap.addEventListener('lostpointercapture',()=>{dragging=false;beakerWrap.classList.remove('dragging');tiltTarget=0})

  function loop(){
    tiltCurrent += (tiltTarget - tiltCurrent) * 0.11
    liquidTilt += ((-tiltCurrent * 0.82) - liquidTilt) * 0.11
    if(!dragging && Math.abs(tiltCurrent)<0.02) tiltCurrent = 0
    if(!dragging && Math.abs(liquidTilt)<0.02) liquidTilt = 0

    beakerWrap.style.setProperty('--tilt',`${tiltCurrent}deg`)
    liquid.style.setProperty('--liquid-tilt',`${liquidTilt}deg`)
    requestAnimationFrame(loop)
  }
  requestAnimationFrame(loop)

  function mixColors(a,b){
    const c1 = hexToRgb(a), c2 = hexToRgb(b)
    return rgbToHex(Math.round((c1.r+c2.r)/2),Math.round((c1.g+c2.g)/2),Math.round((c1.b+c2.b)/2))
  }
  function hexToRgb(hex){const v=hex.replace('#','');return{r:parseInt(v.slice(0,2),16),g:parseInt(v.slice(2,4),16),b:parseInt(v.slice(4,6),16)}}
  function rgbToHex(r,g,b){return '#'+[r,g,b].map(x=>x.toString(16).padStart(2,'0')).join('')}
  function clamp(v,min,max){return Math.max(min,Math.min(max,v))}

  updateLiquid()
  updateDashboard()
}