<template>
  <div class="max-w-4xl flex flex-col gap-lg">
    <h2 class="text-xl font-normal">What is CustomBlocker?</h2>
    <p class="text-gray-800">
      This extension allows you create filters freely.
      For example....
    </p>
    <ul class="list-disc list-inside">
      <li>Block tweets posted by specific apps on twitter</li>
      <li>Block comments which contain unpleasant words or tags on social bookmark sites</li>
      <li>Remove results on specific domains from Google search results</li>
    </ul>
    <h2 class="text-xl font-normal">Simple way to create rules</h2>
    <ol class="list-decimal list-inside">
      <li>Visit your favorite site.</li>
      <li>Click the icon and open pref dialog.</li>
      <li>Click "New Rule for this Site"</li>
      <li>Edit site RegEx if necessary</li>
      <li>Click "Get XPath" button and select XPath which hits desired elements</li>
      <li>Input some keywords</li>
      <li>Save the rule and reload the page</li>
    </ol>
    <p><img :src="helpImgUrl1" class="max-w-full h-auto"></p>
    <h2 class="text-xl font-normal">What is XPath?</h2>
    <p class="text-gray-800 "><strong>XPath</strong> is a language for selecting nodes from XML documents.
      It works well for picking elements from web pages written in HTML.
    </p>
    <p class="text-gray-800 ">
      If you are not familiar with XPath, this extension helps you to get proper XPath and select specific elements as
      intended.
      Click "Get XPath" button and select one of target elements.
      Some XPath expressions are suggested.
    </p>
    <p><img :src="HelpImgUrl2" class="max-w-full h-auto"></p>
    <p class="text-gray-800 ">
      When the mouse cursor is over one of suggested XPaths, elements selected by it are highlighted.
      Click an option which meets intended elements and you can use the selection when the rule is applied.
    </p>
    <p class="text-gray-800 ">Of course, you can write XPath manually.</p>
    <p class="text-gray-800 ">Learn more...</p>
    <ul>
      <li><a href="http://en.wikipedia.org/wiki/XPath" class="text-blue-500 no-underline">XPath - Wikipedia</a></li>
      <li><a href="http://www.w3.org/TR/xpath20/" class="text-blue-500 no-underline">XML Path Language (XPath) 2.0
          (Second Edition)</a></li>
    </ul>
    <h2 class="text-xl font-normal">What does the "RegEx" checkbox on the right hand of the keyword textbox?
    </h2>
    <p class="text-gray-800 ">
      There are two type of keywords, "Simple Match" and "Regular Expression".
      The rule works when the content of an element contains simply "Simple Match" keywords or match "Regular
      Expression" keyword.
      Keywords which are input when "RegEx" checkbox is checked, they work as "Regular Expression".
    </p>
    <h2 class="text-xl font-normal">I want hide some elements whether they contain any keyword or not.</h2>
    <p class="text-gray-800 ">When "Block Anyway" is checked, elements selected by XPath of "Elements to Hide" will be
      hidden, whether keywords are contained or not.</p>
    <h2 class="text-xl font-normal">How can I stop the extension temporarily?</h2>
    <p class="text-gray-800 ">There is two ways to pause the extension.</p>
    <dl class="my-2.5">
      <dt class="font-bold ">Pause all functions temporarily</dt>
      <dd>
        Click the icon on the Chrome's menu bar and select radio buttons "ON/OFF".
        When "OFF" is checked, all rules are stopped.
      </dd>
      <dt class="font-bold ">Pause individual rules temporarily</dt>
      <dd>
        Click the icon on the Chrome's menu bar or show the preference page.
        You'll find "ON/OFF" buttons on the right side of the list of rules.
      </dd>
    </dl>
    <h2 class="text-xl font-normal">Credits/Contact</h2>
    <span>
      This extension is rework of <a href="https://github.com/maripo/CustomFilter" target="_blank" class="text-blue-500 no-underline">CustomFilter</a> 
      project by <a href="http://blog.maripo.org" target="_blank" class="text-blue-500 no-underline">maripo</a>. 
      The original project's development was suspended by the author. 
      The original project is licensed under the MIT License. 
      <button @click="showLicense" class="text-blue-500 hover:underline">View License</button>
    </span>
    <dl class="my-2.5">
      <dt class="font-bold ">Author</dt>
      <dd>Den Inozemtsev</dd>
      <dt class="font-bold ">LinkedIn</dt>
      <dd><a href="https://www.linkedin.com/in/den-inozemtsev-69a182125/" class="text-brand-blue">https://www.linkedin.com/in/den-inozemtsev-69a182125/</a></dd>
      <!-- <dt class="font-bold ">Blog</dt>
      <dd><a href="http://blog.maripo.org" class="text-blue-500 no-underline">http://blog.maripo.org</a></dd>
      <dt class="font-bold ">Source</dt>
      <dd><a href="https://github.com/maripo/CustomFilter"
          class="text-blue-500 no-underline">https://github.com/maripo/CustomFilter</a></dd> -->
      <dt class="font-bold ">Feedback</dt>
      <dd>
        <ul>
          <li><a href="https://docs.google.com/forms/d/e/1FAIpQLSfsgIJkLV-m6l2as9SYDcnWk3gxPTs9vaa9JNbspbs8tT-jNw/viewform?usp=header"
              class="text-blue-500 no-underline">Feedback form</a></li>
        </ul>
      </dd>
    </dl>
  </div>
  
  <LicensePopup ref="licensePopup" />
</template>

<script setup>
import { ref } from 'vue'
import LicensePopup from './LicensePopup.vue'
import HelpImg1 from '~/assets/help/help1-en.png';
import HelpImg2 from '~/assets/help/help3.png';

const helpImgUrl1 = new URL(HelpImg1, import.meta.url).href;
const HelpImgUrl2 = new URL(HelpImg2, import.meta.url).href;


const licensePopup = ref(null)

const showLicense = () => {
  licensePopup.value.open()
}
</script>
