'use strict';
//マップ表示
function initMap() {
  //検索条件
  const category_d = document.condition.category.value;
  const place_d = document.condition.place.value;
  const price_l = document.condition.price_low.value;
  const price_u = document.condition.price_upp.value;
  const floorarea_l = document.condition.floorarea_low.value;
  const floorarea_u = document.condition.floorarea_upp.value;
  const landarea_l = document.condition.landarea_low.value;
  const landarea_u = document.condition.landarea_upp.value;

  // 表示条件 (北見駅 lat:43.80486817859294, lng:143.89721744882345)
  let opts = {
      zoom: 9,
      center: {lat:44.08828384345664, lng:143.85901447911394}
  };

  switch (place_d) {
    case "oho":opts = {zoom: 9, center: {lat:44.08828384345664, lng:143.85901447911394}};break;
    case "ktm":opts = {zoom: 11, center: {lat:43.808036740029955, lng:143.87658901986762}};break;
    case "rbe":opts = {zoom: 13, center: {lat:43.78698717262775, lng:143.6143642687762}};break;
    case "aba":opts = {zoom: 12, center: {lat:43.96667392404678, lng:144.25381431485846}};break;
    case "bih":opts = {zoom: 13, center: {lat:43.82799788266027, lng:144.1053133095588}};break;
    case "one":opts = {zoom: 13, center: {lat:43.75468644445672, lng:143.50762654397755}};break;
    case "kun":opts = {zoom: 13, center: {lat:43.72925064969856, lng:143.73362270553346}};break;
    case "tub":opts = {zoom: 13, center: {lat:43.707872413319826, lng:144.0233556972693}};break;
    case "mem":opts = {zoom: 13, center: {lat:43.91518340387458, lng:144.17149943743016}};break;
    case "shk":opts = {zoom: 11, center: {lat:43.906739764268806, lng:144.53765384410062}};break;
    case "mon":opts = {zoom: 11, center: {lat:44.35232680327222, lng:143.35608000789662}};break;
    default:opts = {zoom: 9, center: {lat:44.08828384345664, lng:143.85901447911394}};break;
  }

  const map = new google.maps.Map(document.getElementById("newPropertiesMap"), opts);
  
  //アイコン設定
  const iconBase = "https://maps.google.com/mapfiles/kml/pal2/";
  const icons = {
    house: {icon: iconBase + "icon10.png"},
    land: {icon: iconBase + "icon12.png"},
  };

  //マーカー配置
  const markers = new Array();
  const infoWindows = new Array();
  let old_infoWindow = -1;
  let old_marker = -1;
  let i = 0;
  for (i = 0; i < data.length; i++) {
    if (data[i].type !==category_d && data[i].price >=price_l && data[i].price <=price_u &&
        data[i].floorarea >= floorarea_l && data[i].floorarea <= floorarea_u &&
        data[i].landarea >= landarea_l && data[i].landarea <= landarea_u) {
        markers[i] = new google.maps.Marker({
            position: new google.maps.LatLng(data[i].lat, data[i].lng),
            icon: icons[data[i].type].icon,
            map: map
        });
        infoWindows[i] = new google.maps.InfoWindow({
            content: data[i].contentString,
            maxWidth: 220
        });
        let marker = markers[i];
        let infoWindow = infoWindows[i];
        marker.addListener("click", () => {
            infoWindow.open(map, marker);
            if (old_marker !== -1) {
                old_infoWindow.close(map, old_marker);
            }
            old_infoWindow = infoWindow;
            if (old_marker === marker) {
              old_marker = -1;
            } else {
              old_marker = marker;
            }
        });
    }
  }
}