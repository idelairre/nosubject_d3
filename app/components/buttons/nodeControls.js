import React from 'react';
import ReactDOM from 'react-dom';
import articles from '../../../output/articles';
import AddRandomNodes from './addRandomNodes';
import graphGenerator from '../../generator/graphGenerator';
import ChartActions from '../../actions/chartActions';
import DropdownMenu from './dropdownMenu';
import fuzzy from 'fuzzy';
import InlineCss from 'react-inline-css';
import { memoize } from 'lodash';
import { Typeahead } from 'react-typeahead';

export default class NodeControls extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      addRandomNodesStatus: "nodeInput--disabled",
      data: articles,
      placeholder: "add node",
      toggleRemove: false,
      typeaheadStatus: "typeahead--active",
      value: ''
     };
  }

  displayOption(option, index) {
    if (this.state.data === articles) {
      return option;
    } else {
      return option.label;
    }
  }

  fuzzyMatch(pattern, str) {
    let cache = memoize((str) => {
      return new RegExp("^" + str.replace(/./g, (x) => {
        return /[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/.test(x) ? "\\"+x+"?" : x+"?";
      })+"$");
    });
    if (this.state.data === articles) {
      if (cache(str.toLowerCase()).test(pattern.toLowerCase())) {
        console.log(str);
        return str;
      }
    } else {
      let node = str;
      if (cache(node.label.toLowerCase()).test(pattern.toLowerCase())) {
        return node.label;
      }
    }
  };

  handleToggle(val) {
    if (val === 'add node') {
      this.setState({ toggleRemove: false, addRandomNodesStatus: "nodeInput--disabled", data: articles, typeaheadStatus: "typeahead--active", placeholder: val });
    } else if (val === 'add random nodes') {
      this.setState({ toggleRemove: false, typeaheadStatus: "typeahead--disabled", addRandomNodesStatus: "nodeInput--active" });
    } else if (val === 'remove node') {
      this.setState({ addRandomNodesStatus: "nodeInput--disabled", data: graphGenerator.storedNodes, toggleRemove: true, typeaheadStatus: "typeahead--active", placeholder: val });
    } else {
      ChartActions.clearGraph();
    }
  }

  handleKeyDown(event) {
    if (event.keyCode === 13) {
      this.setState({ value: null });
      ::this.handleOptionSelected(event.target.value);
    }
  }

  handleOptionSelected(article) {
    if (this.state.toggleRemove === false) {
      ChartActions.generateLinkedNodes(article);
    } else {
      article.label ? article = article.label : null;
      ChartActions.removeNode(article); // returns a node not an article name
    }
  }

  render() {
    return (
      <InlineCss stylesheet={`
       & {
         display: inline-flex;
         height: 21px;
         justifyContent: flex-start;
       }
       & input {
         border: 1px solid #A9A9A9;
         height: 19px;
       }
       & input:focus {
         outline: none;
       }
       & .dropdown {
         height: 21px;
         border: 1px solid #A9A9A9;
         display: inline-block;
         margin: 0px -1px;
       }
       & .typeahead--active {
         display: table-cell;
         positon: relative;
         top: 0;
         left: 0;
       }
       & .typeahead--disabled {
         visibility: hidden;
         height: 0px;
         width: 0px;
       }
       & .nodeInput--active {
         display: table-cell;
         positon: relative;
         top: 0;
         left: 0;
       }
       & .nodeInput--disabled {
         visibility: hidden;
         height: 0px;
         width: 0px;
       }
       & .listItem {
         position: relative;
         width: 50%;
         height: 100%;
         listStyle: none;
         float: left;
       }
       & .results {
         position: absolute;
         background: white;
         minWidth: 400px;
       }`}>
         <Typeahead
            className={this.state.typeaheadStatus}
            displayOption={::this.displayOption}
            filterOption={::this.fuzzyMatch}
            options={this.state.data}
            maxVisible={30}
            onOptionSelected={this.handleOptionSelected.bind(this)}
            placeholder={this.state.placeholder}
            inputProps={{...this.state}}
            onKeyDown={this.handleKeyDown.bind(this)}
            customClasses={{
             input: "typeahead",
             results: "results",
             listItem: "listItem"
           }} />
          <AddRandomNodes className={this.state.addRandomNodesStatus} />
        <DropdownMenu className="dropdown" handleToggle={::this.handleToggle} />
      </InlineCss>
    );
  }
}
