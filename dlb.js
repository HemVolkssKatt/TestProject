const items=document.querySelectorAll(".range-item")
items.forEach(item=>{
    item.addEventListener('click',function(){
        const category=this.getAttribute("data-category");
        
        window.location.href=`Shop.html?category=${category}`;
    })
})