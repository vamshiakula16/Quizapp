import React from "react";
import TreeView from "treeview-react-bootstrap";

export const ReactTreeView = (props) => {
  const data = [
    {
      text: "Expenses",
      nodes: [
        {
          text: "Child 1",
          nodes: [
            {
              text: "Grandchild 2"
            },
            {
              text: "Grandchild 2"
            }
          ]
        },
        {
          text: "Child 2"
        }
      ]
    },
    {
      text: "Expenses"
    },
    {
      text: "Income",
      nodes: [
        { text: "Bonus" },
        {
          text: "Salary"
        }
      ]
    },
    {
      text: "Liabilities",

      nodes: [
        { text: "Credit Card" },
        {
          text: "Loans"
        }
      ]
    }
  ];
  return (
    <>
      <TreeView
        data={props.data}
        onClick={(data, node) => {
          if (node.state.selected) {
            console.log("click", data, node);
            var id = node.text.split(" ")[1];
            props.selectedNode(id);
          }
        }}
      />
    </>
  );
};
