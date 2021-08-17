// ==UserScript==
// @name         Peleton to Echelon
// @version      5.0
// @author       minhur
// @match        https://members.onepeloton.com/*
// @updateURL    https://github.com/minhur/peloton_echelon_metrics/raw/master/peloton_echelon.user.js
// @downloadURL  https://github.com/minhur/peloton_echelon_metrics/raw/master/peloton_echelon.user.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    console.log('script loaded');
    var caption;
    var quality;

    const waitFor = (...selectors) => new Promise(resolve => {
        const delay = 500
        const f = () => {
            const elements = selectors.map(selector => document.querySelector(selector))
            if (elements.every(element => element != null)) {
                resolve(elements)
            } else {
                setTimeout(f, delay)
            }
        }
        f()
    })

    function start() {
        console.log('checking if class has started');

        waitFor('video').then(([video])=>{

            /*
            // auto turn on captions
            caption = setInterval( () =>{
                console.log('checking caption');
                if (jwplayer != undefined) {
                    if (!jwplayer().getCurrentCaptions()) {
                        console.log('turning on caption');
                        jwplayer().setCurrentCaptions(1)
                    } else {
                        console.log('caption is on, clearing interval');
                        clearInterval(caption);
                    }
                }
            }, 2000);

            quality = setInterval( () =>{
                console.log('checking quality');
                if (jwplayer != undefined) {
                    if (jwplayer().getCurrentQuality() === 0) {
                        console.log('lowering quality');
                        jwplayer().setCurrentQuality(5);
                    } else {
                        console.log('quality is on, clearing interval');
                        clearInterval(quality);
                    }
                }
            }, 2000);
            */

            // load metrics
            console.log('video loaded, loading metrics if exists');
            var rideID = (rideID = window.location.pathname.split("/"))[rideID.length - 1];
            fetch("https://api.onepeloton.com/api/ride/" + rideID + "/details?stream_source=multichannel", {
                headers: {
                    accept: "application/json, text/plain, */*",
                    "accept-language": "en-US",
                    "peloton-platform": "web",
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "same-site",
                    "x-requested-with": "XmlHttpRequest"
                },
                referrer: "https://members.onepeloton.com/classes/player/" + rideID,
                referrerPolicy: "no-referrer-when-downgrade",
                body: null,
                method: "GET",
                mode: "cors",
                credentials: "include"
            }).then(function(e) {
                return e.json()
            }).then(function(i) {
                var a = [1,1,1,1,1,2,2,2,3,3,3,4,4,4,4,5,5,5,6,6,6,7,7,7,8,8,8,9,9,9,10,10,10,11,11,11,12,12,12,12,13,13,13,14,14,14,15,15,15,16,16,16,17,17,17,18,18,18,19,19,19,20,20,20,20,21,21,21,22,22,22,23,23,23,24,24,24,25,25,25,26,26,26,27,27,27,28,28,28,28,29,29,29,30,30,30,31,31,31,32,32],
                    o = Number(i.ride.duration),
                    e = document.createElement("div");
                e.id = "cadresist", e.style = "width:100%; color:white; margin:-40px 0px 0px -30px; padding-right: 55px;", e.innerHTML = '<div id="cadresisttxt" style="width:100%;color:white;font-size:24px"></div><div style="margin-top:15px;width:100%; height:2px; background-color:#555555"><div id="cadresistprogress" style="width:0%;transition:990ms linear;height:4px;background-color:white"></div></div>', document.querySelector("div[data-test-id='videoSongContainer']").after(e);
                var c = document.getElementById("cadresisttxt"),
                    d = document.getElementById("cadresistprogress");
                if (!i.instructor_cues.length) return e.innerHTML = "Class does not have target metrics.", void setTimeout(function() {
                    e.innerHTML = ""
                }, 5e3);
                if (i.instructor_cues.length) {
                    c.innerHTML = 'Warmup Session';
                }
                for (var t = [], r = i.instructor_cues[0], n = 1; n < i.instructor_cues.length; n++) {
                    var s = i.instructor_cues[n];
                    r.resistance_range.upper == s.resistance_range.upper && r.resistance_range.lower == s.resistance_range.lower && r.cadence_range.upper == s.cadence_range.upper && r.cadence_range.lower == s.cadence_range.lower ? r.offsets.end = s.offsets.end : (t.push(r), r = s)
                }
                t.push(s), i.instructor_cues = t, console.dir(i.instructor_cues);
                var u = document.querySelector("div[data-test-id='video-timer']");
                new MutationObserver(function(e) {
                    var t = document.querySelector("p[data-test-id='time-to-complete']");
                    if (!t) return;
                    if (2 != (t = t.innerHTML.split(":")).length) return;
                    for (var r = o - (60 * Number(t[0]) + Number(t[1])) + Number(i.ride.pedaling_start_offset), n = 0; n < i.instructor_cues.length; n++) {
                        var s = i.instructor_cues[n];
                        if (r >= Number(s.offsets.start) && r <= Number(s.offsets.end)) return c.innerHTML = "Cadence: " + s.cadence_range.lower + " - " + s.cadence_range.upper + "&nbsp;&nbsp;&nbsp;&nbsp; Resistance: " + a[s.resistance_range.lower] + " - " + a[s.resistance_range.upper] + "&nbsp;&nbsp; (" + s.resistance_range.lower + " - " + s.resistance_range.upper + ")", void(r == Number(s.offsets.start) ? (d.style.transition = "none", d.style.width = "0%") : (d.style.transition = "990ms linear", d.style.width = Math.round((r - s.offsets.start) / (s.offsets.end - s.offsets.start) * 100) + "%"))
                    }
                }).observe(u, {
                    attributes: !0,
                    childList: !0,
                    subtree: !0,
                    characterData: !0
                })
            })
        })
    };

    // start if video
    if (window.location.href.indexOf('player') !== -1) {
        start();
    }
    // detect url changes
    (function(history){
        var pushState = history.pushState;
        history.pushState = function(state, key, path) {
            if (typeof history.onpushstate == "function") {
                history.onpushstate({state: state, path: path})
            }
            pushState.apply(history, arguments)
        }

        window.onpopstate = history.onpushstate = function(e) {
            if (e.path.indexOf('player') !== -1) {
                start();
            } else {
                console.log('stop');
                // clearInterval(interval);
            }
        }

    })(window.history);


})();
