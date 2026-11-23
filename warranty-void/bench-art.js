/* Visual-only repair bench artwork. Keeps diagnostic and repair logic in engine.js. */
const WarrantyBenchArt = (() => {
  const wrap = (body, accent) => [
    '<svg class="appliance-svg" viewBox="0 0 800 480" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">',
    '<defs>',
    '<linearGradient id="metal" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#78928c"/><stop offset=".5" stop-color="#374b50"/><stop offset="1" stop-color="#1d3238"/></linearGradient>',
    '<linearGradient id="inset" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#17282b"/><stop offset="1" stop-color="#2d4444"/></linearGradient>',
    '<pattern id="mesh" width="12" height="12" patternUnits="userSpaceOnUse"><path d="M0 12L12 0" stroke="#78968c" stroke-width=".65" opacity=".2"/></pattern>',
    '</defs>',
    '<ellipse cx="400" cy="434" rx="286" ry="27" fill="#071214" opacity=".56"/>',
    '<g class="appliance-shell">',body,'</g>',
    '<g fill="#1a292c" stroke="#95aaa4" stroke-width="3"><circle cx="187" cy="113" r="6"/><circle cx="613" cy="113" r="6"/><circle cx="187" cy="382" r="6"/><circle cx="613" cy="382" r="6"/></g>',
    '<rect x="304" y="391" width="192" height="21" rx="7" fill="#0f2224" stroke="#65817a"/>',
    '<text x="400" y="405" text-anchor="middle" fill="'+accent+'" font-family="monospace" font-size="11" letter-spacing="2">SERVICE ACCESS OPEN</text>',
    '</svg>'
  ].join("");

  const designs = {
    toaster: wrap([
      '<rect x="164" y="115" width="472" height="286" rx="41" fill="url(#metal)" stroke="#a8b1a4" stroke-width="10"/>',
      '<rect x="194" y="138" width="413" height="231" rx="21" fill="url(#inset)" stroke="#809990" stroke-width="4"/>',
      '<rect x="225" y="159" width="162" height="73" rx="14" fill="#142428" stroke="#c7b18c" stroke-width="7"/>',
      '<rect x="411" y="159" width="162" height="73" rx="14" fill="#142428" stroke="#c7b18c" stroke-width="7"/>',
      '<path d="M238 178H375M238 195H375M425 178H558M425 195H558" stroke="#d7a66f" stroke-width="4" opacity=".7"/>',
      '<rect x="214" y="250" width="377" height="95" rx="9" fill="url(#mesh)" stroke="#6f8b83" stroke-dasharray="8 6"/>',
      '<path d="M257 294H544" stroke="#d99a64" stroke-width="6" stroke-linecap="round"/>',
      '<path d="M277 274V315M323 274V315M370 274V315M417 274V315M463 274V315M511 274V315" stroke="#e6b178" stroke-width="2.5" opacity=".85"/>',
      '<rect x="620" y="246" width="30" height="94" rx="12" fill="#e3c29a" stroke="#332c23" stroke-width="5"/>',
      '<rect x="150" y="277" width="33" height="17" rx="8" fill="#d5aa7b"/>',
      '<text x="400" y="121" text-anchor="middle" font-family="monospace" font-size="13" fill="#f1cca2">TM–80 • DO NOT FEED AFTER MIDNIGHT</text>'
    ].join(""),"#f1b77c"),
    fan: wrap([
      '<path d="M310 385H496L481 415H325Z" fill="#a0b9b0" stroke="#172e32" stroke-width="6"/>',
      '<rect x="374" y="300" width="53" height="105" rx="15" fill="url(#metal)" stroke="#7f9896" stroke-width="5"/>',
      '<circle cx="400" cy="200" r="153" fill="#24383d" stroke="#a5bdb9" stroke-width="14"/>',
      '<circle cx="400" cy="200" r="130" fill="url(#mesh)" stroke="#708f90" stroke-width="5"/>',
      '<g fill="#6a9ea5" stroke="#b5d2cd" stroke-width="3">',
      '<path d="M401 202C430 113 352 85 331 117C307 158 356 193 401 202Z"/>',
      '<path d="M401 202C476 226 521 165 496 139C465 107 417 153 401 202Z"/>',
      '<path d="M401 202C372 288 443 329 471 299C499 267 454 217 401 202Z"/>',
      '<path d="M401 202C320 179 277 234 303 271C334 305 378 251 401 202Z"/>',
      '</g>',
      '<circle cx="400" cy="200" r="36" fill="#d9b788" stroke="#253d40" stroke-width="9"/>',
      '<g stroke="#b4d3ca" stroke-width="3" opacity=".7"><path d="M400 59V340M260 200H540M300 100L500 300M500 100L300 300"/></g>',
      '<rect x="289" y="365" width="223" height="46" rx="16" fill="#2b4347" stroke="#9cb6aa" stroke-width="4"/>',
      '<circle cx="459" cy="388" r="12" fill="#e5b77d"/><circle cx="499" cy="388" r="7" fill="#b8e6cc"/>',
      '<text x="400" y="43" text-anchor="middle" font-family="monospace" font-size="14" fill="#b9d5d3">AIRFLOW SUPERVISION DIVISION</text>'
    ].join(""),"#b7e9df"),
    lamp: wrap([
      '<path d="M270 392H526L549 420H246Z" fill="url(#metal)" stroke="#829a92" stroke-width="7"/>',
      '<rect x="305" y="367" width="189" height="34" rx="15" fill="#2a454a" stroke="#90a99f" stroke-width="4"/>',
      '<path d="M388 366L468 270L363 200L409 134" fill="none" stroke="#8da9a5" stroke-width="28" stroke-linecap="round" stroke-linejoin="round"/>',
      '<path d="M388 366L468 270L363 200L409 134" fill="none" stroke="#263e43" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"/>',
      '<g fill="#efbf86" stroke="#253b3e" stroke-width="7"><circle cx="388" cy="366" r="18"/><circle cx="468" cy="270" r="17"/><circle cx="363" cy="200" r="17"/></g>',
      '<path d="M311 80L485 64L565 195H237Z" fill="url(#metal)" stroke="#b5bca9" stroke-width="9" stroke-linejoin="round"/>',
      '<path d="M329 99L476 91L525 177H277Z" fill="#283b3a" stroke="#e0c995" stroke-width="4"/>',
      '<path d="M361 125L442 116L468 183H331Z" fill="#efd091" opacity=".5"/>',
      '<circle cx="400" cy="187" r="32" fill="#f9dfaa" stroke="#cfa765" stroke-width="6"/>',
      '<path d="M351 238L310 293M453 226L501 257" stroke="#e6bb80" stroke-width="3" opacity=".7"/>',
      '<g fill="#c8e6d5"><circle cx="339" cy="386" r="6"/><circle cx="362" cy="386" r="6"/><circle cx="385" cy="386" r="6"/></g>',
      '<text x="402" y="449" text-anchor="middle" font-family="monospace" font-size="14" fill="#e8d8a0">CL–9 / BRIGHT IDEAS DEPARTMENT</text>'
    ].join(""),"#f0d49a"),
    fridge: wrap([
      '<rect x="239" y="26" width="322" height="422" rx="23" fill="url(#metal)" stroke="#a0b7a9" stroke-width="9"/>',
      '<rect x="261" y="45" width="277" height="163" rx="10" fill="url(#inset)" stroke="#8ca8a7" stroke-width="6"/>',
      '<rect x="261" y="223" width="277" height="192" rx="10" fill="url(#inset)" stroke="#8ca8a7" stroke-width="6"/>',
      '<path d="M278 113H525M278 170H525M278 285H525M278 359H525" stroke="#7db5b2" stroke-width="7" opacity=".62"/>',
      '<path d="M319 70V191M389 70V191M470 70V191M319 243V395M389 243V395M470 243V395" stroke="#6b948f" stroke-width="3" opacity=".28"/>',
      '<rect x="490" y="80" width="18" height="82" rx="9" fill="#d3c59e" stroke="#445659" stroke-width="4"/>',
      '<rect x="490" y="256" width="18" height="86" rx="9" fill="#d3c59e" stroke="#445659" stroke-width="4"/>',
      '<circle cx="400" cy="244" r="13" fill="#bbefe4" opacity=".75"/>',
      '<rect x="338" y="37" width="124" height="19" rx="5" fill="#101f26" stroke="#679f9a"/>',
      '<text x="400" y="51" text-anchor="middle" font-family="monospace" font-size="11" fill="#a4efe5">COLD DIPLOMAT</text>',
      '<path d="M230 444H283M517 444H569" stroke="#abc5ba" stroke-width="14" stroke-linecap="round"/>'
    ].join(""),"#b5eadc")
  };
  return {render(deviceId){return designs[deviceId] || designs.toaster;}};
})();
