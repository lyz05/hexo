---
title: 友情链接
date: 2021-08-07 17:47:03
type: "links"
comments: false
---
<div class="links-content">
<div class="no-icon note warning"><div class="link-info">😁欢迎与我交换友链</div></div>
<div class="link-navigation">
{% for link in site.data.links.defaultlinks %}
<div class="card">
<img class="ava nomediumzoom" src="{{ link.avatar }}"/>
<div class="card-header">
<div><a href="{{ link.site }}" target="_blank"> {{ link.name }}</a> </div>
<div class="info">{{ link.info }}</div>
</div>
</div>
{% endfor %}
</div>