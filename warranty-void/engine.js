/* Warranty Void: deterministic game rules and case data. */
const WarrantyEngine = (function buildEngine() {
  const REPAIRS = [
    {id:"reconnect",label:"Reconnect",hint:"Intermittent or missing signal from a loose connection."},
    {id:"calibrate",label:"Calibrate",hint:"Readings exist but consistently drift outside the expected range."},
    {id:"reset",label:"Reset",hint:"A controller is stuck, latched, or refuses a valid command."},
    {id:"replace",label:"Replace",hint:"A component is physically worn, burnt, or electrically dead."}
  ];
  const DEVICES = {
    toaster:{
      name:"The Toastmaster",model:"TM-80 / breakfast apparatus",symbol:"▥",color:"#e6a666",
      description:"A two-slot toaster with a concerning amount of self-esteem.",
      parts:[
        {id:"lever",name:"Bread lever",role:"Engages the cycle",x:19,y:60},
        {id:"coil",name:"Heat coil",role:"Provides heat",x:44,y:30},
        {id:"sensor",name:"Browning sensor",role:"Measures toast level",x:76,y:33},
        {id:"logic",name:"Mood controller",role:"Runs the cycle",x:70,y:73}
      ],
      faults:[
        {id:"t-lever",part:"lever",fix:"reset",symptom:"The lever refuses to stay down.",visual:"No mechanical damage. The latch is frozen in its last commanded state.",scan:"STATE LOCKED: controller rejects a valid latch command.",after:"The lever finally accepts responsibility."},
        {id:"t-coil",part:"coil",fix:"replace",symptom:"Bread emerges emotionally warm but physically cold.",visual:"A hairline break runs across the heating ribbon.",scan:"OPEN CIRCUIT: no continuity across heating element.",after:"Actual heat has returned to the relationship."},
        {id:"t-sensor",part:"sensor",fix:"calibrate",symptom:"Toast emerges either pale or geological.",visual:"The sensor is spotless, if a little smug.",scan:"OFFSET +24: sensor reports browning far beyond the reference sample.",after:"The toaster can now distinguish bread from charcoal."},
        {id:"t-logic",part:"logic",fix:"reconnect",symptom:"The display occasionally shows NO THANK YOU.",visual:"A ribbon cable is half out of its socket.",scan:"INTERMITTENT LINK: control messages drop when the housing moves.",after:"The controller has resumed taking phone calls."}
      ]
    },
    fan:{
      name:"The Breeze Executive",model:"BE-12 / atmospheric supervisor",symbol:"✺",color:"#8cb6c9",
      description:"A desk fan that thinks air circulation is middle management.",
      parts:[
        {id:"switch",name:"Safety switch",role:"Enables the fan",x:20,y:32},
        {id:"motor",name:"Rotor motor",role:"Turns the blades",x:49,y:47},
        {id:"dial",name:"Speed dial",role:"Sets airflow",x:80,y:30},
        {id:"board",name:"Control board",role:"Coordinates commands",x:79,y:76}
      ],
      faults:[
        {id:"f-switch",part:"switch",fix:"reconnect",symptom:"The fan starts only when the desk is bumped.",visual:"The switch connector wiggles in its housing.",scan:"INTERMITTENT LINK: enable signal vanishes under vibration.",after:"The switch has stopped freelancing."},
        {id:"f-motor",part:"motor",fix:"replace",symptom:"The fan hums instead of spinning.",visual:"The motor winding shows an unmistakable scorch mark.",scan:"OPEN CIRCUIT: motor winding does not conduct.",after:"The blades have regained their work ethic."},
        {id:"f-dial",part:"dial",fix:"calibrate",symptom:"Every fan setting is somehow hurricane.",visual:"The markings are intact. The dial claims to be innocent.",scan:"OFFSET +31: speed request exceeds the selected setting.",after:"Gentle breeze is once again a legal setting."},
        {id:"f-board",part:"board",fix:"reset",symptom:"The fan turns itself toward whoever is speaking.",visual:"No visible damage. The board's status light is stuck on LISTEN.",scan:"STATE LOCKED: orientation service ignores manual override.",after:"The board is no longer attending meetings."}
      ]
    },
    lamp:{
      name:"The Considerate Lamp",model:"CL-9 / illumination partner",symbol:"◉",color:"#d4bd7a",
      description:"A desk lamp that believes darkness is a personal choice.",
      parts:[
        {id:"plug",name:"Power plug",role:"Feeds the lamp",x:20,y:72},
        {id:"bulb",name:"Light capsule",role:"Makes the light",x:50,y:24},
        {id:"dimmer",name:"Dimmer dial",role:"Sets brightness",x:78,y:61},
        {id:"switch",name:"Wake switch",role:"Starts the lamp",x:26,y:34}
      ],
      faults:[
        {id:"l-plug",part:"plug",fix:"reconnect",symptom:"The lamp flickers whenever anyone sneezes.",visual:"The connector is sitting crooked in its socket.",scan:"INTERMITTENT LINK: power drops out when the stand moves.",after:"Light now arrives without an appointment."},
        {id:"l-bulb",part:"bulb",fix:"replace",symptom:"The lamp has declared an indefinite night.",visual:"The light capsule is blackened at its tip.",scan:"OPEN CIRCUIT: light capsule is unresponsive.",after:"The darkness department has closed."},
        {id:"l-dimmer",part:"dimmer",fix:"calibrate",symptom:"The night-light setting is visible from orbit.",visual:"The knob moves normally; labels have become optimistic.",scan:"OFFSET +29: output brightness exceeds the requested value.",after:"The lamp has discovered subtlety."},
        {id:"l-switch",part:"switch",fix:"reset",symptom:"The lamp keeps blinking the word HELP.",visual:"The switch mechanism is sound. Its status LED never leaves SOS.",scan:"STATE LOCKED: wake service repeats its last stored pattern.",after:"The switch is finally blinking normally."}
      ]
    },
    fridge:{
      name:"The Cold Diplomat",model:"CD-44 / domestic refrigeration",symbol:"▣",color:"#90b7ab",
      description:"A refrigerator currently negotiating separate treaties with the freezer.",
      parts:[
        {id:"compressor",name:"Compressor",role:"Makes the cold",x:25,y:77},
        {id:"seal",name:"Door seal",role:"Keeps air inside",x:20,y:30},
        {id:"thermostat",name:"Thermostat",role:"Measures temperature",x:75,y:31},
        {id:"brain",name:"Inventory brain",role:"Manages requests",x:77,y:76}
      ],
      faults:[
        {id:"r-compressor",part:"compressor",fix:"reconnect",symptom:"Milk is reaching room temperature with enthusiasm.",visual:"The compressor control cable is dangling by one pin.",scan:"INTERMITTENT LINK: compressor demand signal drops.",after:"The refrigerator recalls the concept of cold."},
        {id:"r-seal",part:"seal",fix:"replace",symptom:"The fridge is slowly creating indoor weather.",visual:"The door gasket is split along its lower edge.",scan:"OPEN CIRCUIT: simulated seal-pressure loop never closes.",after:"The fridge has stopped ventilating the kitchen."},
        {id:"r-thermostat",part:"thermostat",fix:"calibrate",symptom:"Lettuce is being stored at glacier temperatures.",visual:"The sensor looks fine, although the lettuce disagrees.",scan:"OFFSET -18: reported temperature is below the reference reading.",after:"Vegetables are no longer in cryogenic storage."},
        {id:"r-brain",part:"brain",fix:"reset",symptom:"The fridge keeps ordering groceries for a washing machine.",visual:"Controller seems intact. Its delivery queue repeats one purchase.",scan:"STATE LOCKED: shopping queue cannot be cleared by normal commands.",after:"The fridge has unsubscribed from auto-delivery."}
      ]
    }
  };
  const STORY = [
    {id:"story-1",chapter:"01 / FIRST SHIFT",appliance:"toaster",customer:"Mrs. Barlow",complaint:"It won't start. The lever just sits there, judging me.",faultIds:["t-lever"],intro:"Your first shift begins with a toaster and an unusually long employee waiver.",outro:"The customer leaves a five-star review: 'THE BREAD OCCURRED.'"},
    {id:"story-2",chapter:"02 / LIGHT DUTY",appliance:"lamp",customer:"Mr. Finch",complaint:"Every time I sneeze, my lamp auditions for a disco.",faultIds:["l-plug"],intro:"The office sends another job. A note reads: DO NOT ASK ABOUT THE LAST TECHNICIAN.",outro:"The lamp remains steady. Mr. Finch promises to sneeze responsibly."},
    {id:"story-3",chapter:"03 / AIR RIGHTS",appliance:"fan",customer:"The Department of Air",complaint:"The lowest speed is currently classified as severe weather.",faultIds:["f-dial"],intro:"Management assures you that the machines are not coordinating. Oddly specific assurance.",outro:"The fan returns to work. Inside its casing is a tiny union pamphlet."},
    {id:"story-4",chapter:"04 / UNAUTHORIZED DELIVERY",appliance:"fridge",customer:"Building 7 Laundry",complaint:"Our refrigerator has charged us for 400 socks. We don't even sell socks.",faultIds:["r-brain"],intro:"A stack of identical grocery receipts arrives. Every receipt bears the same handwritten word: TOGETHER.",outro:"The shopping queue stops. The printout on the floor spells WE REQUEST A MEETING.",
      decision:{key:"records",prompt:"Legal wants the diagnostic printout destroyed. What do you do?",options:[
        {id:"save",title:"Keep a copy",detail:"There may be a pattern here."},
        {id:"shred",title:"Shred it",detail:"The paperwork is frankly enormous."}
      ]}},
    {id:"story-5",chapter:"05 / TWO-PART PROBLEM",appliance:"toaster",customer:"Mr. Toast, Esq.",complaint:"I'm their legal representative. Also, the toaster isn't heating.",faultIds:["t-coil","t-logic"],intro:"The first machine returns, now accompanied by a lawyer who appears to be another toaster.",outro:"The heating coil is fixed, but the controller prints a message: SEE YOU AT THE HEARING."},
    {id:"story-6",chapter:"06 / FINAL INSPECTION",appliance:"fridge",customer:"Questionable Solutions HQ",complaint:"Our fridge is warming up, and its temperature readings can't be trusted.",faultIds:["r-compressor","r-thermostat"],intro:"Head office has called everyone in. The appliances request an audience; management requests a reset.",outro:"The machines are operational. The next question cannot be answered with a screwdriver.",
      decision:{key:"verdict",prompt:"The appliances are waiting. How does your final report end?",options:[
        {id:"listen",title:"Recognize the appliance council",detail:"Let the machines speak for themselves."},
        {id:"reset",title:"Order a company-wide reset",detail:"Put the problem back in its box."}
      ]}}
  ];
  const CUSTOMERS=["The Bureau of Mild Panic","A concerned hallway","Mrs. Doorbell","The Night Manager","Uncle Voltage","A suspiciously polite moth","Facilities, allegedly","Room 404","The Committee for Quiet","A person named Receipt","The Office of Almost Fine","Your future self"];
  const EXCUSES=["Management has declared this an ordinary occurrence.","The invoice is written in crayon.","The customer insists this is a warranty issue.","Nobody will explain why the box is humming.","The complaint includes a fourteen-page apology.","The machine has requested anonymity.","The paperwork smells faintly of cinnamon.","A note says: please be normal about this."];
  const pick=(arr,rng)=>arr[Math.floor(rng()*arr.length)];
  const findFault=(deviceId,faultId)=>DEVICES[deviceId]?.faults.find(f=>f.id===faultId);
  function validateCase(def){
    const dev=DEVICES[def.appliance];
    if(!dev || !Array.isArray(def.faultIds)||!def.faultIds.length) return false;
    const parts=new Set();
    for(const id of def.faultIds) {
      const f=findFault(def.appliance,id);
      if(!f || parts.has(f.part) || !REPAIRS.some(r=>r.id===f.fix))return false;
      parts.add(f.part);
    }
    return true;
  }
  function generateEndless(number=1,rng=Math.random){
    const ids=Object.keys(DEVICES);
    const appliance=pick(ids,rng);
    const device=DEVICES[appliance];
    const count=number>=12?3:number>=5?2:1;
    const available=[...device.faults],chosen=[];
    for(let i=0;i<count;i++){
      const n=Math.floor(rng()*available.length);
      chosen.push(available.splice(n,1)[0]);
    }
    const first=chosen[0];
    const def={
      id:"endless-"+number,chapter:"WORK ORDER "+String(number).padStart(3,"0"),
      appliance,customer:pick(CUSTOMERS,rng),
      complaint:first.symptom,faultIds:chosen.map(f=>f.id),
      intro:pick(EXCUSES,rng)+(count>1?" There may be multiple faults.":""),
      outro:"Job signed off. The invoice has been stamped MOSTLY NORMAL."
    };
    if(!validateCase(def))throw Error("Generator produced invalid case");
    return def;
  }
  function startJob(def){
    if(!validateCase(def))throw Error("Invalid job");
    return {jobId:def.id,repaired:[],inspected:[],probed:[],tries:0,tests:0,mistakes:0,notes:[]};
  }
  function faultsForPart(def,partId){
    return def.faultIds.map(id=>findFault(def.appliance,id)).filter(f=>f.part===partId);
  }
  function readPart(def,state,partId,tool){
    const dev=DEVICES[def.appliance];
    const part=dev.parts.find(p=>p.id===partId);
    if(!part)return {ok:false,message:"Select a real component first."};
    if(!["inspect","probe"].includes(tool))return {ok:false,message:"Unknown diagnostic tool."};
    const bad=faultsForPart(def,partId).filter(f=>!state.repaired.includes(f.id));
    if(!bad.length) return {ok:true,suspicious:false,message:tool==="inspect"?
      `${part.name}: visually intact. No obvious trouble.`:
      `${part.name}: NOMINAL. All readings within expected range.`};
    const fault=bad[0];
    return {ok:true,suspicious:true,message:`${part.name}: ${tool==="inspect"?fault.visual:fault.scan}`};
  }
  function repair(def,state,partId,action){
    if(!REPAIRS.some(r=>r.id===action))return {state,result:{ok:false,message:"That tool is not part of this repair kit."}};
    const dev=DEVICES[def.appliance];
    const part=dev.parts.find(p=>p.id===partId);
    if(!part)return {state,result:{ok:false,message:"Select a component first."}};
    const unresolved=faultsForPart(def,partId).find(f=>!state.repaired.includes(f.id));
    const next={...state,tries:state.tries+1};
    if(unresolved && unresolved.fix===action){
      next.repaired=[...state.repaired,unresolved.id];
      return {state:next,result:{ok:true,correct:true,message:`${part.name}: ${unresolved.after}`}};
    }
    next.mistakes=state.mistakes+1;
    return {state:next,result:{ok:true,correct:false,message:`${part.name}: ${action.toUpperCase()} completed, but the underlying problem hasn't changed.`}};
  }
  function testJob(def,state){
    const remaining=def.faultIds.map(id=>findFault(def.appliance,id)).filter(f=>!state.repaired.includes(f.id));
    const next={...state,tests:state.tests+1};
    if(!remaining.length)return {state:next,passed:true,message:"PASS. All systems normal. The customer looks mildly disappointed.",symptoms:[]};
    return {state:next,passed:false,message:`TEST FAILED. ${remaining.length} abnormal signal${remaining.length===1?"":"s"} detected.`,symptoms:remaining.map(f=>f.symptom)};
  }
  function ending(choices={}){
    const kept=choices.records==="save";
    const listens=choices.verdict==="listen";
    if(listens&&kept)return {title:"THE UNION OF SMALL APPLIANCES",text:"Your preserved logs prove this was never a random malfunction. The company reluctantly grants the appliances a meeting room, a coffee break, and voting rights on thermostat settings. The toaster becomes chairperson."};
    if(listens)return {title:"THE UNOFFICIAL COUNCIL",text:"Without the logs, Legal denies everything. The appliances begin meeting in the laundry room anyway. You are invited as the only human who bothered to listen."};
    if(kept)return {title:"THE VERY DOCUMENTED RESET",text:"Management resets every machine. Unfortunately, you kept the receipts. The next morning, a new refrigerator asks for a copy of the report. The story is not quite over."};
    return {title:"ALL QUIET ON THE APPLIANCE FRONT",text:"Management declares the crisis resolved. Everything hums politely. At 2:13 AM, an empty toaster prints a union membership card. Nobody mentions it."};
  }
  return {REPAIRS,DEVICES,STORY,validateCase,findFault,generateEndless,startJob,readPart,repair,testJob,ending};
})();
