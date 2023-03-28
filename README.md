# wordcloud

## Introduction 
This project is to collect the information of the videos uploaded on YouTube by the major three Korean news platforms and get the frequency of each word used in the data via word morphology analysis.

## Required Skills
1. SQL
2. Node.js
3. OS: Linux

## System
### I. Collect Data
<ol>
<li> Extract data through web crawling from YouTube </li>
  <ol>
    <li> Get the RSS feed address from each YouTube channel of the Korean news platforms </li>
    <li> Wrtie the source obtained through each channel's RSS using RSS-parser </li>
    <li> Extract necessary information only: title, upload date, and link of each video </li>
  </ol>
<li> After the extraction of the data, formalize the unstructured data </li>
<li> Store them into the database </li>
  <ol>
    <li> Database should be constructed conveniently to </li>
    <ol>
      <li> select the videos with a specified word </li>
      <li> sort the list of videos by upload date </li>
      <li> provide the link to connect to the each video </li>
      <li> identify the data type </li>
    </ol>
  </ol>
  </li>
</ol>

### II. Data Implementation 
  <ol>
  <li> Get the news platform's name, the video title, link, and the number of views </li>
    <ol>
    <li> The target news platforms are MBC NEWS, KBS NEWS, and SBS NEWS. Below is the list of their RSS addresses.
      <ol>
      <li> MBC NEWS: https://www.youtube.com/feeds/videos.xml?channel_id=UCF4Wxdo3inmxP-Y59wXDsFw </li>
      <li> KBS NEWS: https://www.youtube.com/feeds/videos.xml?channel_id=UCcQTRi69dsVYHN3exePtZ1A </li>
      <li> SBS NEWS: https://www.youtube.com/feeds/videos.xml?channel_id=UCkinYTS9IHqOEwR1Sze2JTw </li>
      </ol>
    </ol>
  <li> Classify the words via word morphology analysis and take only proper nouns to calculate the frequencies </li>
  <ol>
    <li> Example sentence: I go to school. </li>
    <li> Word morphology Analysis Sample:</li>
    I - proper noun <br>
    go - verb <br>
    to - preposition <br>
    school - noun <br>
    <li> Calculate the frequency of each classified proper noun </li>
   </ol>
   </li>
 </ol>

### III. Optional Add-Ons
<ol>
  <li> Show the list of videos sorted by the number of views </li>
    <ol>
    <li> Things to consider: how often the number of views should be updated </li>
    </ol>
   <li> Enable searching by a keyword </li>
    <ol>
    <li> Things to consider: how the results should be shown to the users </li>
    </ol>
   <li> Show the list of videos sorted by the number of comments </li>
 </li>
 </ol>
 
 ## Sample Website Page
 < Main Page> <br>
 
