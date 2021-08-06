---
title: 剪切板 <small> 基于leancloud </small>

date: 2015-12-11 18:55:44

type: "about"

comments: false

---
<style>
  .field-textarea {
	width: 100%; /*自动适应父布局宽度*/
	overflow: auto;
	word-break: break-all;
  }
</style>
<!-- LeanCloud -->
<!-- <script src="//cdn.jsdelivr.net/npm/leancloud-storage@4.7.0/dist/av-min.js"></script> -->
<!-- 无需加载 av-min.js -->
<script src="//cdn.jsdelivr.net/npm/leancloud-storage@4.7.0/dist/av-live-query-min.js"></script>
<!-- jQuery -->
<script src="//cdn.jsdelivr.net/npm/jquery@3.2.1/dist/jquery.min.js"></script>
<!-- clipboard -->
<script type="text/javascript" src="index.js"></script>
<div class="textarea-wrapper">
    <textarea class="field-textarea" rows="25" name="content" id="content"></textarea>
</div>
<center><div id="footer">正在加载</div></center>
