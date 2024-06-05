import{mute as e,unmute as t}from"./noise.js";import{toggleClassToArr as n,slowHideElement as i}from"./util.js";const s="./assets/images/volume_on.svg",o="./assets/images/volume_off.svg",c={isVolumeOn:!0};let u={};const d={isVolumeOn:!0},r={isTicketDisplayed:!1,isSettingsOpen:!1,ticketOpened:null,exitOpen:!1};let l,a=()=>!0;function m(e){l=e}function g(e){a=e}function k(){u.volumeImg.src=d.isVolumeOn?s:o,(d.isVolumeOn?t:e)()}function v(){d.isVolumeOn=!d.isVolumeOn,localStorage.setItem("settings",JSON.stringify(d)),k()}function y(){r.isSettingsOpen=!r.isSettingsOpen,u.settingsButton.classList.toggle("clicked"),u.subSettingsBtn.classList.toggle("settings-slide-in")}function S(){r.isTicketDisplayed&&(u.settingsTickets.forEach(e=>{e.classList.add("hidden-animation")}),r.isTicketDisplayed=!1,r.ticketOpened=null,l.API.enabled=!0,u.ticketCount.classList.remove("hidden"))}function f(e){r.isTicketDisplayed&&e===r.ticketOpened?S():(r.isTicketDisplayed&&S(),(e=e).classList.remove("hidden-animation"),r.isTicketDisplayed=!0,r.ticketOpened=e,l.API.enabled=!1,u.ticketCount.classList.add("hidden"))}function p(){r.exitOpen=!1,l.API.enabled=!0,n([u.exitConfirmation,u.ticketCount,u.settings],"hidden"),i(u.cover),u.cover.removeEventListener("click",p)}function O(e){"Escape"===e.key&&(r.isTicketDisplayed?S():r.isSettingsOpen&&u.cover.classList.contains("hidden")?y():r.exitOpen&&p())}function E(){r.exitOpen=!0,l.API.enabled=!1,u.unsavedChangesMsg.style.display=a()?"none":"inline",S(),n([u.exitConfirmation,u.cover,u.ticketCount,u.settings],"hidden"),u.confirmExit.addEventListener("click",window.location.reload.bind(window.location),{once:!0}),u.denyExit.addEventListener("click",p,{once:!0}),u.cover.addEventListener("click",p,{once:!0})}document.addEventListener("DOMContentLoaded",function(){var e;(u={settings:document.querySelector(".settings-menu-container"),settingsButton:document.querySelector(".settings-menu-button img"),volume:document.querySelector(".volume"),volumeImg:document.querySelector(".volume img"),exitButton:document.querySelector(".exit-zoltar"),subSettingsBtn:document.querySelector(".settings-menu-settings"),closeTicket:document.querySelectorAll(".close-settings-ticket"),creditsButton:document.querySelector(".credits-button"),creditsTicket:document.querySelector(".credits"),instructionsButton:document.querySelector(".instructions-button"),instructionsTicket:document.querySelector(".instructions"),ticketCount:document.querySelector(".count-tickets-icon"),cover:document.querySelector(".cover"),settingsTickets:document.querySelectorAll(".settings-ticket"),exitConfirmation:document.querySelector(".exit-confirmation"),confirmExit:document.querySelector("#leave-button"),denyExit:document.querySelector("#stay-button"),unsavedChangesMsg:document.querySelector("#unsaved-warning")}).exitButton.addEventListener("click",E),u.settingsButton.addEventListener("click",y),u.volume.addEventListener("click",v),u.instructionsButton.addEventListener("click",()=>{f(u.instructionsTicket)}),u.creditsButton.addEventListener("click",()=>{f(u.creditsTicket)}),u.closeTicket.forEach(e=>{e.addEventListener("click",S)}),window.addEventListener("keydown",O),e=JSON.parse(localStorage.getItem("settings"))||c,Object.entries(e).forEach(([e,t])=>{d[e]=t}),k()});export{d as settings,m as setControls,g as setSafeToExitFunc};