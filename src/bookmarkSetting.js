import * as React from 'react'
import dayjs from 'dayjs'

/*
[
    {
        url:"/bike/station/?...",
        title:"...",
        modifiedDate: Time(),
        summery:"非必要"
    }
]

*/
function createBookmarkRoot(callbackFunc, callbackPars) {
    localStorage.setItem("bookmarks", "[]")
    callbackFunc(callbackPars)
}
function saveBookmarks(current) {
    localStorage.setItem("bookmarks", JSON.stringify(current))
}
export function bookmarkSetting(type, pars) {
    var allBookmarks = JSON.parse(localStorage.getItem("bookmarks"))
    if (!allBookmarks) createBookmarkRoot(bookmarkSetting, type)

    if (type === "check") {
        var { url, title } = pars
        var c = false
        for (let i = 0; i < allBookmarks.length; i++) {
            if (allBookmarks[i].title === title) {
                c = true
                return true
            }
        }
        if (!c) return false
    }

    else if (type === "add") {
        if (!bookmarkSetting("check", { url: pars.url, title: pars.title })) {
            allBookmarks.push(pars)
        }
        saveBookmarks(allBookmarks)
    } else if (type === "delete") {//del by url
        var filtered = allBookmarks.filter(function (el) { return el.url != pars.url; });
        allBookmarks = filtered
        saveBookmarks(allBookmarks)
    }
    else if (type === "toggle") {
        //toggle就是:在list就刪，不在list就加
        if (!bookmarkSetting("check", { url: pars.url })) {
            allBookmarks.push(pars)
        }
        else {
            var filtered = allBookmarks.filter(function (el) { return el.url != pars.url; });
            allBookmarks = filtered
        }
        saveBookmarks(allBookmarks)
    }
    else if (type === "get") {
        return allBookmarks
    }
}