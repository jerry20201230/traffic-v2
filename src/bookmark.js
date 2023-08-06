import * as React from 'react'

export function bookmarkSetting(type,pars){
    if(type === "check"){
        try{
            var allBookmarks = JSON.parse(localStorage.getItem("bookmarks"))
            var {url} = pars
        }
        catch(e){
            localStorage.setItem("bookmarks","[]")
            return false
        }
        if(allBookmarks.includes(url)){
            return true
        }
        return false
    }

    else if(type === "add"){
        if(!bookmarkSetting("check",{url:pars.url})){
            var allBookmarks = JSON.parse(localStorage.getItem("bookmarks"))
            allBookmarks.push(pars)
        }
    }else if(type === "delete"){//del by url
        var allBookmarks = JSON.parse(localStorage.getItem("bookmarks"))
        var filtered = allBookmarks.filter(function(el) { return el.url != pars.url; }); 
        allBookmarks = filtered
    }
}