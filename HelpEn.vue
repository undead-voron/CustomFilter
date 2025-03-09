<template>
  <header class="header">
    <h1 class="header__title"><img src="../img/top_title.png" alt="CustomBlocker for Google Chrome"></h1>
    <div class="header__donate">
      <a class="custom_filter_localize_donate" id="donate_link" href="#donate">Donate</a>
    </div>
    <nav class="header__tabs">
      <div class="header__tabs__tab">
        <a class="header__tabs__tab__link" href="index.html?p=p4">
          <span class="custom_filter_localize_prefTitle">Manage Rules</span>
        </a>
      </div>
      <div class="header__tabs__tab">
        <a class="header__tabs__tab__link" id="word_group_link" href="word_group.html">
          <span class="custom_filter_localize_word_group">Word Groups</span>
        </a>
      </div>
      <div class="header__tabs__tab header__tabs__tab--selected">
        <a class="header__tabs__tab__link" id="help_link" href="help_en.html">
          <span class="custom_filter_localize_help">Help</span>
        </a>
      </div>
    </nav>
  </header>
  <div id="wrapper">
    <h2>What is CustomBlocker?</h2>
    <p>
      This extension allows you create filters freely.
      For example....
    </p>
    <ul>
      <li>Block tweets posted by specific apps on twitter</li>
      <li>Block comments which contain unpleasant words or tags on social bookmark sites</li>
      <li>Remove results on specific domains from Google search results</li>
    </ul>
    <h2>Simple way to create rules</h2>
    <ol>
      <li>Visit your favorite site.</li>
      <li>Click the icon and open pref dialog.</li>
      <li>Click "New Rule for this Site"</li>
      <li>Edit site RegEx if necessary</li>
      <li>Click "Get XPath" button and select XPath which hits desired elements</li>
      <li>Input some keywords</li>
      <li>Save the rule and reload the page</li>
    </ol>
    <p><img src="../img/help/help1-en.png"></p>
    <h2>What is XPath?</h2>
    <p><strong>XPath</strong> is a language for selecting nodes from XML documents.
      It works well for picking elements from web pages written in HTML.
    </p>
    <p>
      If you are not familiar with XPath, this extension helps you to get proper XPath and select specific elements as intended.
      Click "Get XPath" button and select one of target elements.
      Some XPath expressions are suggested.
    </p>
    <p><img src="../img/help/help3.png"></p>
    <p>
      When the mouse cursor is over one of suggested XPaths, elements selected by it are highlighted.
      Click an option which meets intended elements and you can use the selection when the rule is applied.
    </p>
    <p>Of course, you can write XPath manually.</p>
    <p>Learn more...</p>
    <ul>
      <li><a href="http://en.wikipedia.org/wiki/XPath">XPath - Wikipedia</a></li>
      <li><a href="http://www.w3.org/TR/xpath20/">XML Path Language (XPath) 2.0 (Second Edition)</a></li>
    </ul>
    <h2>What does the "RegEx" checkbox on the right hand of the keyword textbox?</h2>
    <p>
      There are two type of keywords, "Simple Match" and "Regular Expression".
      The rule works when the content of an element contains simply "Simple Match" keywords or match "Regular Expression" keyword.
      Keywords which are input when "RegEx" checkbox is checked, they work as "Regular Expression".
    </p>
    <h2>I want hide some elements whether they contain any keyword or not.</h2>
    <p>When "Block Anyway" is checked, elements selected by XPath of "Elements to Hide" will be hidden, whether keywords are contained or not.</p>
    <p><img src="../img/help/help2-en.png"></p>
    <h2>What does the number on the icon mean?</h2>
    <p>It means how many elements are hidden on the current web page.</p>
    <p><img src="../img/help/blocked.png"></p>
    <p>This functionality can be disabled by unchecking "Show number of blocked elements on app icon" on the preferences page.</p>
    <h2>How can I stop the extension temporarily?</h2>
    <p>There is two ways to pause the extension.</p>
    <dl>
      <dt>Pause all functions temporarily</dt>
      <dd>
        Click the icon on the Chrome's menu bar and select radio buttons "ON/OFF".
        When "OFF" is checked, all rules are stopped.
      </dd>
      <dt>Pause individual rules temporarily</dt>
      <dd>
        Click the icon on the Chrome's menu bar or show the preference page.
        You'll find "ON/OFF" buttons on the right side of the list of rules.
      </dd>
    </dl>
    <h2><a name="donate">How can I support the developer?</a></h2>
    <p>If you are interested in joining the development project or sending a pull request, please visit the<a href="https://github.com/maripo/CustomFilter">Github repository</a>.</p>
    <p>
      Currently CustomBlocker supports English and Japanese but I don't have strong confidence in my English skill.
      Please let me know if you find something wrong or unnatural.
      Now this app is gaining popularity in South Korea and I'm looking for contributor who is familiar with Korean language.
    </p>
    <p>I'd be very grateful and encouraged if you could donate on Amazon.co.jp.</p>
    <ul>
      <li><a href="https://www.amazon.co.jp/gp/registry/wishlist/2Y41EUS5A1FFW/ref=cm_wl_huc_view">Developer's Wishlist @amazon.co.jp</a></li>
      <li><a href="https://www.amazon.co.jp/Amazon%E3%82%AE%E3%83%95%E3%83%88%E5%88%B8-1-JP-Email-Amazon%E3%82%AE%E3%83%95%E3%83%88%E5%88%B8-E%E3%83%A1%E3%83%BC%E3%83%AB%E3%82%BF%E3%82%A4%E3%83%97-Amazon%E3%83%99%E3%83%BC%E3%82%B7%E3%83%83%E3%82%AF/dp/B004N3APGO/ref=lp_3131877051_1_2?s=gift-cards&amp;ie=UTF8&amp;qid=1495266397&amp;sr=1-2">Amazon.co.jp eGift card</a> to goda.mariko@gmail.com</li>
    </ul>
    <h2>Credits/Contact</h2>
    <dl>
      <dt>Author</dt>
      <dd>Maripo GODA <goda.mariko@gmail.com></dd>
      <dt>Blog</dt>
      <dd><a href="http://blog.maripo.org">http://blog.maripo.org</a></dd>
      <dt>Source</dt>
      <dd><a href="https://github.com/maripo/CustomFilter">https://github.com/maripo/CustomFilter</a></dd>
      <dt>Feedback</dt>
      <dd>
        <ul>
          <li><a href="https://twitter.com/MaripoGoda">Developer's Twitter</a></li>
          <li><a href="https://github.com/maripo/CustomFilter/issues">GitHub Issues</a></li>
          <li><a href="https://docs.google.com/spreadsheet/viewform?formkey=dGRTeWxoSEVRa1J4a0NJU0dhQklsT1E6MQ">Contact form</a></li>
        </ul>
      </dd>
    </dl>
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue';

// Import any necessary dependencies or types here

onMounted(() => {
  // Initialize any necessary functionality that was previously handled by the imported scripts
  // This would need to be implemented based on what the original JS files were doing
  
  // Examples might include:
  // - Setting up event listeners
  // - Initializing UI components
  // - Loading data
  
  // For a complete implementation, you would need to analyze the behavior of:
  // - src/CustomBlocker.js
  // - src/pref/list_rules.js
  // - src/pref/help.js
});
</script>

<style>
/* Header styles */
.header {
  padding: 0px;
  margin-bottom: 6px;
  position: relative;
}
.header__title {
  font-weight: normal;
}
.header__donate {
  text-align: right;
  width: 200px;
  height: auto;
  position: absolute;
  top: 0px;
  right: 0px;
}
.header__donate a {
  text-decoration: none;
  color: #0db3ea;
  font-size: 120%;
}
.header__tabs {
  height: 24px;
  padding: 0px;
  margin: 8px 0px;
}
.header__tabs__tab {
  display: block;
  list-style-type: none;
  width: 25%;
  height: inherit;
  float: left;
  text-align: center;
  color: #666;
}
.header__tabs__tab__link {
  height: inherit;
  display: block;
  text-decoration: none;
  line-height: 24px;
  color: inherit;
}
.header__tabs__tab--selected {
  background-color: #0db3ea;
  color: white;
}

/* Help page specific styles */
h2 {
  font-size: 130%;
  font-weight: normal;
  padding-left: 4px;
  padding-top: 10px;
}

p {
  color: #222;
  padding: 2px 4px;
  margin: 2px 2px;
}

/* General body styling */
body {
  margin: 0px;
  padding: 0px;
  font-family: 'Hiragino Kaku Gothic ProN', 'ヒラギノ角ゴ ProN W3', 'YuGothic', 'Yu Gothic', 'メイリオ', 'Meiryo', 'ＭＳ ゴシック', 'Lucida Grande', 'Helvetica', 'Arial', sans-serif;
}

a {
  text-decoration: none;
  color: #0db3ea;
}

/* List styles */
ul, ol {
  margin-left: 20px;
}

/* Definition list styles */
dl {
  margin: 10px 0;
}

dt {
  font-weight: bold;
  margin-top: 10px;
}

dd {
  margin-left: 20px;
}

/* Image styles */
img {
  max-width: 100%;
  height: auto;
}

/* Wrapper for main content */
#wrapper {
  max-width: 960px;
  margin: 0 auto;
  padding: 0 15px;
}
</style> 