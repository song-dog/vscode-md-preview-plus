var N=Object.create;var M=Object.defineProperty;var K=Object.getOwnPropertyDescriptor;var R=Object.getOwnPropertyNames;var W=Object.getPrototypeOf,L=Object.prototype.hasOwnProperty;var P=(e,n)=>{for(var o in n)M(e,o,{get:n[o],enumerable:!0})},Z=(e,n,o,i)=>{if(n&&typeof n=="object"||typeof n=="function")for(let t of R(n))!L.call(e,t)&&t!==o&&M(e,t,{get:()=>n[t],enumerable:!(i=K(n,t))||i.enumerable});return e};var H=(e,n,o)=>(o=e!=null?N(W(e)):{},Z(n||!e||!e.__esModule?M(o,"default",{value:e,enumerable:!0}):o,e)),U=e=>Z(M({},"__esModule",{value:!0}),e);var ae={};P(ae,{activate:()=>oe,deactivate:()=>re});module.exports=U(ae);function O(e){if(e===void 0||e.type!=="inline")return;let n=e.content.split(`
`);if(n.length<=1)return;let o=n[0].trim();if(!o.startsWith("[!"))return;let i=/^\[[!](note|warning|important|caution|tip)\]$/,t=o.toLowerCase().match(i);return t===null?null:t[1]}var I=H(require("vscode"),1);function S(e){let n=(o,...i)=>{let{escapeSpecialCharacters:t=!1}=e,r=[...o].reduce((l,c,u)=>l+c+(i[u]||""),"").split(`
`).filter(l=>l.trim()!==""),s=Math.min(...r.map(l=>l.match(/^\s*/)[0].length));return r.map(l=>(l=l.substring(s),t?l.replace(/\\\n[ \t]*/g,"").replace(/\\`/g,"`").replace(/\\\$/g,"$").replace(/\\\{/g,"{"):l)).join(`
`)};return n.withOptions=o=>S({...e,...o}),n}var D=S({}),b=D;function g(e){return e.charAt(0).toUpperCase()+e.slice(1)}function _(e){if(!e.theme){let t=["light","dark","dark","light"];e.theme=t[I.window.activeColorTheme.kind]}let{name:n,theme:o,icon:i}=e;return b`
    <div class="github-alert ga-${n}" theme="${o}">
      <span class="ga-title">
        <svg xmlns="http://www.w3.org/2000/svg" class="ga-${i.name}" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true">
          <path d="${i.path}"/>
        </svg>
        ${g(n)}
      </span>
      <span class="ga-content">
  `}function j(){return b`
      </span>
    </div>
  `}function J(e){return e===9||e===32}function v(e,n,o,i){let t=e.bMarks[n]+e.tShift[n],r=e.eMarks[n],s=e.lineMax;if(e.sCount[n]-e.blkIndent>=4||e.src.charCodeAt(t)!==62)return!1;if(i)return!0;let l=[],c=[],u=[],p=[],h=e.md.block.ruler.getRules("blockquote"),d=e.parentType;e.parentType="blockquote";let A=!1,a;for(a=n;a<o;a++){let m=e.sCount[a]<e.blkIndent;if(t=e.bMarks[a]+e.tShift[a],r=e.eMarks[a],t>=r)break;if(e.src.charCodeAt(t++)===62&&!m){let f=e.sCount[a]+1,k,C;e.src.charCodeAt(t)===32?(t++,f++,C=!1,k=!0):e.src.charCodeAt(t)===9?(k=!0,(e.bsCount[a]+f)%4===3?(t++,f++,C=!1):C=!0):k=!1;let x=f;for(l.push(e.bMarks[a]),e.bMarks[a]=t;t<r;){let $=e.src.charCodeAt(t);if(J($))$===9?x+=4-(x+e.bsCount[a]+(C?1:0))%4:x++;else break;t++}A=t>=r,c.push(e.bsCount[a]),e.bsCount[a]=e.sCount[a]+1+(k?1:0),u.push(e.sCount[a]),e.sCount[a]=x-f,p.push(e.tShift[a]),e.tShift[a]=t-e.bMarks[a];continue}if(A)break;let T=!1;for(let f=0,k=h.length;f<k;f++)if(h[f](e,a,o,!0)){T=!0;break}if(T){e.lineMax=a,e.blkIndent!==0&&(l.push(e.bMarks[a]),c.push(e.bsCount[a]),p.push(e.tShift[a]),u.push(e.sCount[a]),e.sCount[a]-=e.blkIndent);break}l.push(e.bMarks[a]),c.push(e.bsCount[a]),p.push(e.tShift[a]),u.push(e.sCount[a]),e.sCount[a]=-1}let E=e.blkIndent;e.blkIndent=0;let y=e.push("blockquote_open","blockquote",1);y.markup=">",y.map=[n,0],e.md.block.tokenize(e,n,a);let F=e.push("blockquote_close","blockquote",-1);F.markup=">",e.lineMax=s,e.parentType=d;for(let m=0;m<p.length;m++)e.bMarks[m+n]=l[m],e.tShift[m+n]=p[m],e.sCount[m+n]=u[m],e.bsCount[m+n]=c[m];return e.blkIndent=E,!0}var Q=[{name:"note",icon:{name:"info",path:"M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8Zm8-6.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13ZM6.5 7.75A.75.75 0 0 1 7.25 7h1a.75.75 0 0 1 .75.75v2.75h.25a.75.75 0 0 1 0 1.5h-2a.75.75 0 0 1 0-1.5h.25v-2h-.25a.75.75 0 0 1-.75-.75ZM8 6a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z"}},{name:"tip",icon:{name:"light-bulb",path:"M8 1.5c-2.363 0-4 1.69-4 3.75 0 .984.424 1.625.984 2.304l.214.253c.223.264.47.556.673.848.284.411.537.896.621 1.49a.75.75 0 0 1-1.484.211c-.04-.282-.163-.547-.37-.847a8.456 8.456 0 0 0-.542-.68c-.084-.1-.173-.205-.268-.32C3.201 7.75 2.5 6.766 2.5 5.25 2.5 2.31 4.863 0 8 0s5.5 2.31 5.5 5.25c0 1.516-.701 2.5-1.328 3.259-.095.115-.184.22-.268.319-.207.245-.383.453-.541.681-.208.3-.33.565-.37.847a.751.751 0 0 1-1.485-.212c.084-.593.337-1.078.621-1.489.203-.292.45-.584.673-.848.075-.088.147-.173.213-.253.561-.679.985-1.32.985-2.304 0-2.06-1.637-3.75-4-3.75ZM5.75 12h4.5a.75.75 0 0 1 0 1.5h-4.5a.75.75 0 0 1 0-1.5ZM6 15.25a.75.75 0 0 1 .75-.75h2.5a.75.75 0 0 1 0 1.5h-2.5a.75.75 0 0 1-.75-.75Z"}},{name:"important",icon:{name:"report",path:"M0 1.75C0 .784.784 0 1.75 0h12.5C15.216 0 16 .784 16 1.75v9.5A1.75 1.75 0 0 1 14.25 13H8.06l-2.573 2.573A1.458 1.458 0 0 1 3 14.543V13H1.75A1.75 1.75 0 0 1 0 11.25Zm1.75-.25a.25.25 0 0 0-.25.25v9.5c0 .138.112.25.25.25h2a.75.75 0 0 1 .75.75v2.19l2.72-2.72a.749.749 0 0 1 .53-.22h6.5a.25.25 0 0 0 .25-.25v-9.5a.25.25 0 0 0-.25-.25Zm7 2.25v2.5a.75.75 0 0 1-1.5 0v-2.5a.75.75 0 0 1 1.5 0ZM9 9a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z"}},{name:"warning",icon:{name:"alert",path:"M6.457 1.047c.659-1.234 2.427-1.234 3.086 0l6.082 11.378A1.75 1.75 0 0 1 14.082 15H1.918a1.75 1.75 0 0 1-1.543-2.575Zm1.763.707a.25.25 0 0 0-.44 0L1.698 13.132a.25.25 0 0 0 .22.368h12.164a.25.25 0 0 0 .22-.368Zm.53 3.996v2.5a.75.75 0 0 1-1.5 0v-2.5a.75.75 0 0 1 1.5 0ZM9 11a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z"}},{name:"caution",icon:{name:"stop",path:"M4.47.22A.749.749 0 0 1 5 0h6c.199 0 .389.079.53.22l4.25 4.25c.141.14.22.331.22.53v6a.749.749 0 0 1-.22.53l-4.25 4.25A.749.749 0 0 1 11 16H5a.749.749 0 0 1-.53-.22L.22 11.53A.749.749 0 0 1 0 11V5c0-.199.079-.389.22-.53Zm.84 1.28L1.5 5.31v5.38l3.81 3.81h5.38l3.81-3.81V5.31L10.69 1.5ZM8 4a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 8 4Zm0 8a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z"}}];function X(e,n,o,i,t){let r=e[n];return r.meta&&r.meta.gitHubAlert?_(r.meta.gitHubAlert):t.renderToken(e,n,o)}function Y(e,n,o,i,t){let r=e[n];return r.meta&&r.meta.isGitHubAlert?j():t.renderToken(e,n,o)}function w(e){e.renderer.rules.blockquote_open=X,e.renderer.rules.blockquote_close=Y,e.block.ruler.at("blockquote",(n,o,i,t)=>{let r=v(n,o,i,t);if(!r)return!1;let s=n.tokens,l=s[s.length-1];if(l.type!=="blockquote_close")return r;let c;for(c=s.length-2;c>=0;c--){let d=s[c];if(d===null)throw new Error("Opening tag not found for blockquote!");if(d.type==="blockquote_open")break}let u=s[c+2],p=O(u);if(!p)return r;let h=Q.find(d=>d.name===p);return u.content=u.content.split(`
`).slice(1).join(`
`),s[c].meta={isGitHubAlert:!0,gitHubAlert:h},l.meta={isGitHubAlert:!0},r},{alt:["paragraph","reference","blockquote","list"]})}function B(e){if(e===void 0||e.type!=="inline")return;let n=e.content.split(`
`);if(n.length<=1)return;let o=n[0].trim();if(!o.startsWith("[!"))return;let i=/^\[[!](note|abstract|summary|tldr|info|todo|tip|hint|important|success|check|done|question|help|faq|warning|caution|attention|failure|fail|missing|danger|error|bug|example|quote|cite)\](\+|-|)$/,t=o.toLowerCase().match(i);return t===null?null:{name:t[1],isCollapsible:t[2]!=="",initialState:t[2]==="+"?"open":"closed"}}var V=H(require("vscode"),1);function G(e){if(!e.theme){let s=["light","dark","dark","light"];e.theme=s[V.window.activeColorTheme.kind]}let{name:n,theme:o,icon:i,isCollapsible:t,initialState:r}=e;return b`
    <div class="obsidian-callout oc-${n} ${t?"is-collapsible":""}" theme="${o}">
      <${t?"label":"div"} class="oc-heading">
        <div class="oc-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="oc-${i.name}">
            ${i.components.map(s=>b`
                <${s.name} ${Object.entries(s.attrs).map(([l,c])=>`${l}="${c}"`).join(" ")} />
              `).join("")}
          </svg>
        </div>
        <div class="oc-title">${g(n)}</div>
        ${t?`<div class="oc-fold">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-chevron-down">
            <path d="m6 9 6 6 6-6"/>
          </svg>
        </div>`:""}
        ${t?'<input name="oc-state" type="checkbox" '+(r==="open"?"":"checked")+"/>":""}
      </${t?"label":"div"}>
      <div class="oc-content">
  `}function z(){return b`
      </div>
    </div>
  `}var ee=[{aliases:["note","custom"],icon:{name:"lucide-pencil",components:[{name:"path",attrs:{d:"M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"}},{name:"path",attrs:{d:"m15 5 4 4"}}]}},{aliases:["abstract","summary","tldr"],icon:{name:"lucide-clipboard-list",components:[{name:"rect",attrs:{x:8,y:2,width:8,height:4,rx:1,ry:1}},{name:"path",attrs:{d:"M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"}},{name:"path",attrs:{d:"M12 11h4"}},{name:"path",attrs:{d:"M12 16h4"}},{name:"path",attrs:{d:"M8 11h.01"}},{name:"path",attrs:{d:"M8 16h.01"}}]}},{aliases:["info"],icon:{name:"lucide-info",components:[{name:"circle",attrs:{cx:12,cy:12,r:10}},{name:"path",attrs:{d:"M12 16v-4"}},{name:"path",attrs:{d:"M12 8h.01"}}]}},{aliases:["todo"],icon:{name:"lucide-check-circle-2",components:[{name:"circle",attrs:{cx:12,cy:12,r:10}},{name:"path",attrs:{d:"m9 12 2 2 4-4"}}]}},{aliases:["tip","hint","important"],icon:{name:"lucide-flame",components:[{name:"path",attrs:{d:"M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"}}]}},{aliases:["success","check","done"],icon:{name:"lucide-check",components:[{name:"path",attrs:{d:"M20 6 9 17l-5-5"}}]}},{aliases:["question","help","faq"],icon:{name:"lucide-help-circle",components:[{name:"circle",attrs:{cx:12,cy:12,r:10}},{name:"path",attrs:{d:"M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"}},{name:"path",attrs:{d:"M12 17h.01"}}]}},{aliases:["warning","caution","attention"],icon:{name:"lucide-alert-triangle",components:[{name:"path",attrs:{d:"m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"}},{name:"path",attrs:{d:"M12 9v4"}},{name:"path",attrs:{d:"M12 17h.01"}}]}},{aliases:["failure","fail","missing"],icon:{name:"lucide-x",components:[{name:"path",attrs:{d:"M18 6 6 18"}},{name:"path",attrs:{d:"m6 6 12 12"}}]}},{aliases:["danger","error"],icon:{name:"lucide-zap",components:[{name:"polygon",attrs:{points:"13 2 3 14 12 14 11 22 21 10 12 10 13 2"}}]}},{aliases:["bug"],icon:{name:"lucide-bug",components:[{name:"path",attrs:{d:"m8 2 1.88 1.88"}},{name:"path",attrs:{d:"M14.12 3.88 16 2"}},{name:"path",attrs:{d:"M9 7.13v-1a3.003 3.003 0 1 1 6 0v1"}},{name:"path",attrs:{d:"M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6"}},{name:"path",attrs:{d:"M12 20v-9"}},{name:"path",attrs:{d:"M6.53 9C4.6 8.8 3 7.1 3 5"}},{name:"path",attrs:{d:"M6 13H2"}},{name:"path",attrs:{d:"M3 21c0-2.1 1.7-3.9 3.8-4"}},{name:"path",attrs:{d:"M20.97 5c0 2.1-1.6 3.8-3.5 4"}},{name:"path",attrs:{d:"M22 13h-4"}},{name:"path",attrs:{d:"M17.2 17c2.1.1 3.8 1.9 3.8 4"}}]}},{aliases:["example"],icon:{name:"lucide-list",components:[{name:"line",attrs:{x1:8,y1:6,x2:21,y2:6}},{name:"line",attrs:{x1:8,y1:12,x2:21,y2:12}},{name:"line",attrs:{x1:8,y1:18,x2:21,y2:18}},{name:"line",attrs:{x1:3,y1:6,x2:3.01,y2:6}},{name:"line",attrs:{x1:3,y1:12,x2:3.01,y2:12}},{name:"line",attrs:{x1:3,y1:18,x2:3.01,y2:18}}]}},{aliases:["quote","cite"],icon:{name:"lucide-quote",components:[{name:"path",attrs:{d:"M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"}},{name:"path",attrs:{d:"M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"}}]}}];function ne(e,n,o,i,t){let r=e[n];return r.meta&&r.meta.obsidianCallout?G(r.meta.obsidianCallout):t.renderToken(e,n,o)}function te(e,n,o,i,t){let r=e[n];return r.meta&&r.meta.isObsidianCallout?z():t.renderToken(e,n,o)}function q(e){e.renderer.rules.blockquote_open=ne,e.renderer.rules.blockquote_close=te,e.block.ruler.at("blockquote",(n,o,i,t)=>{let r=v(n,o,i,t);if(!r)return!1;let s=n.tokens,l=s[s.length-1];if(l.type!=="blockquote_close")return r;let c;for(c=s.length-2;c>=0;c--){let d=s[c];if(d===null)throw new Error("Opening tag not found for blockquote!");if(d.type==="blockquote_open")break}let u=s[c+2],p=B(u);if(!p)return r;let h=ee.find(d=>d.aliases.includes(p.name));return h.name=p.name,h.isCollapsible=p.isCollapsible,h.initialState=p.initialState,u.content=u.content.split(`
`).slice(1).join(`
`),s[c].meta={isObsidianCallout:!0,obsidianCallout:h},l.meta={isObsidianCallout:!0},r},{alt:["paragraph","reference","blockquote","list"]})}function oe(e){return{extendMarkdownIt(n){return n.use(w).use(q)}}}function re(){}0&&(module.exports={activate,deactivate});
