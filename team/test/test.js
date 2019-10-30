const { expect, assert } = require('chai')
const puppeteer = require('puppeteer')
const server = require('../app.js')


const port = 3000



describe('ChatRoom 測試', async function () {
    let page,brosewr,amother_page
    before(async function () {
        this.timeout(10000);
        await server.listen(3000)
        browser = await puppeteer.launch({
            headless: true
        });
        page = await browser.newPage();
        another_page = await browser.newPage();
        await page.goto('http://localhost:3000/chatroom.html');
        await another_page.goto('http://localhost:3000/chatroom.html');
    })
    it('不寫名稱,只傳訊息', async function () {
        await page.type('#message','helll,fish')
        await page.click('#submit')
        var room = await page.evaluate(function () {  
            return document.querySelector('#room').innerHTML
        })
        expect(room).to.equal('\n        ');
        await page.evaluate(function () {   //將訊息取消
            document.querySelector('#message').value = ''
        })
    })
    it('寫名稱,不寫訊息', async function () {
        await page.type('#name','fish')
        await page.type('#message','')
        await page.click('#submit')
        var room = await page.evaluate(function () {  
            return document.querySelector('#room').innerHTML
        })
        expect(room).to.equal('\n        '); 
        await page.evaluate(function () {   //將名稱取消
            document.querySelector('#name').value = ''
        })
    })
    it('寫名稱+訊息,正常傳送', async function () {
        await page.type('#name','fish')
        await page.type('#message','cool cool')
        await page.click('#submit')
        var board_name = await page.evaluate(function () { 
            return document.querySelectorAll('.namebox')[0].innerText
        })
        var board_message = await page.evaluate(function () { 
            return document.querySelectorAll('.messagebox')[0].innerHTML
        })
        var room = await page.evaluate(function () { 
            console.log(document.querySelector('#room').innerHTML) 
            return document.querySelector('#room').innerHTML
        })
        expect(board_name).to.equal('fish');
        expect(board_message).to.have.string("cool cool");
        expect(room).to.not.equal('\n        ');
    })
    it('另一個用戶收到訊息',async function(){
        var board_name = await another_page.evaluate(function () { 
            return document.querySelectorAll('.namebox')[0].innerText
        })
        var board_message = await another_page.evaluate(function () { 
            return document.querySelectorAll('.messagebox')[0].innerHTML
        })
        var room = await another_page.evaluate(function () { 
            console.log(document.querySelector('#room').innerHTML) 
            return document.querySelector('#room').innerHTML
        })
        expect(board_name).to.equal('fish');
        expect(board_message).to.have.string("cool cool");
        expect(room).to.not.equal('\n        ');
    })
    after(async function () {
        server.close()
        await browser.close()
    })
})

