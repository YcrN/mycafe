'use strict';

{
  document.querySelector('#listData').addEventListener('click', () => {

    // 子ノードを全削除
    const listdata = document.getElementById("listItem");
    if (listdata.hasChildNodes()){
      for (let i=listdata.childNodes.length-1; i>=0; i--) {
        listdata.removeChild(listdata.childNodes[i]);
      }
    }

    //検索条件
    const category_d = document.condition.category.value;
    const place_d = document.condition.place.value;
    const price_l = document.condition.price_low.value;
    const price_u = document.condition.price_upp.value;
    const floorarea_l = document.condition.floorarea_low.value;
    const floorarea_u = document.condition.floorarea_upp.value;
    const landarea_l = document.condition.landarea_low.value;
    const landarea_u = document.condition.landarea_upp.value;

    //リスト表示
    let i = 0;
    for (i = 0; i < data.length; i++) {
      if (data[i].type !==category_d && data[i].price >=price_l && data[i].price <=price_u &&
          data[i].floorarea >= floorarea_l && data[i].floorarea <= floorarea_u &&
          data[i].landarea >= landarea_l && data[i].landarea <= landarea_u) {

            const li = document.createElement('li');
            const color = data[i].listString;
            // li.textContent = color;
            li.innerHTML = color;
            document.querySelector('#listItem').appendChild(li);

      }
    }
  });
}