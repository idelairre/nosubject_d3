import React from 'react';
import Dropdown, { DropdownTrigger, DropdownContent } from 'react-simple-dropdown';
import InlineCss from 'react-inline-css';

export default class DropdownMenu extends React.Component {
  handleClick(event) {
    this.props.handleToggle(event.target.text);
  }

  render() {
      return (
        <InlineCss stylesheet={`
        & a {
          text-decoration: underline;
          color: blue;
          width: 100%;
          padding: 5px;
        }

        & a:hover {
          cursor: pointer;
        }

        & .dropdown__content {
            display: none;
            position: absolute;
        }

        & .dropdown--active .dropdown__content {
            display: inline-block;
        }

        & .list {
         display: inline-block;
         position: absolute;
         width: 400px;
         margin-left: 4px;
        }

        & li {
         position: relative;
         width: 90px;
         height: 100%;
         float: left;
         }`}>
          <Dropdown>
              <DropdownTrigger>></DropdownTrigger>
              <DropdownContent>
                  <div className="list">
                    •<a onClick={::this.handleClick}>add node</a>
                    •<a onClick={::this.handleClick}>add random nodes</a>
                    •<a onClick={::this.handleClick}>remove node</a>
                    •<a onClick={::this.handleClick}>reset graph</a>
                  </div>
              </DropdownContent>
          </Dropdown>
        </InlineCss>
      );
  }
}
