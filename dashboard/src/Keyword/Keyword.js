import React, { useState } from 'react';
import axios from 'axios';
import { removeStopwords, eng, ita } from 'stopword';
import './keyword.css';

const Keyword = () => {
    const [inputValue, setInputValue] = useState('');

    const loadPage = async () => {
        /* loadPage function uses axios library to get the response data from url (input user)
            And then it converts the html data to text
        */
       try {
        const response = await axios.get(inputValue).then(response => response.data);
        const parser = new DOMParser();
        const doc = parser.parseFromString(response, 'text/html');
        return doc.body.textContent;
       } catch (error) {
        console.log(`Error: ${error}`)
       }
    }

    const textManipulation = async () => {
        /* textManipulation function gets the text content from loadPage function
            then remove whitespaces, tabs, newlines and check for stopwords
            in english and albanian language and returns an array with words from the text
        */
        const albanianStopWords = ['a', 'apo', 'asnjë', 'asnje', 'ata', 'ato', 'ca',
                        'deri', 'dhe', 'do', 'e', 'i', 'jam', 'janë', 'jane', 'jemi',
                        'jeni', 'ju', 'juaj', 'kam', 'kaq', 'ke', 'kemi', 'kete', 'çdo',
                        'këtë', 'më', 'me', 'mu', 'në', 'ne', 'nëse', 'nese', 'një', 'nga',
                        'nje', 'nuk', 'pa', 'pas', 'pasi',  'për', 'per', 'prej', 'që',
                        'qe', 'sa', 'së', 'se', 'seç', 'sec', 'si', 'saj', 'të', 'te', 'ti',
                        'tek', 'tij', 'tonë', 'tone', 'tuaj', 'ty', 'tyre', 'unë', 'une', 'veç', 'vec'
        ];
        let text = await loadPage();
        text = text.replace(/[\t\n]/g, ' ');
        text = text.replace(/[^\w\sçÇëË]|_/g, '').trim().split(' ');
        text = removeStopwords(text, [...eng, ...ita, ...albanianStopWords]);
        return text.map(word => word.replace(/\s/g, '')).filter(word => word.trim() !== '');
    }

    const checkWords = async () => {
        /* checkWords function get the array from textManipulation function
            checks for words and their frequency and add them to an object
            { key: value } => { word: frequency }
            creates an array with all words sorted in desc order
        */
        const newText = await textManipulation();
        const frequentedWords = {};

        for (const word of newText) {
            if (frequentedWords.hasOwnProperty(word)) {
                frequentedWords[word]++;
            } else {
                frequentedWords[word] = 1;
            }
        }

        const entries = Object.entries(frequentedWords).sort(([, a], [, b]) => b - a).map(([word]) => word)
        console.log(entries)
    }

    const handleChange = (event) => {
        setInputValue(event.target.value)
    }

    return (
        <div className='keywordContainer'>
            <input className='urlInput' type='text' placeholder='URL' name='Url Input' value={inputValue} onChange={handleChange} />
            <button className='analyzeBtn' onClick={checkWords}>Analyze</button>
        </div>
    );
}
 
export default Keyword;