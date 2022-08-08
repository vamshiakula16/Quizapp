import "./styles.css";

import React, { useEffect, useState } from "react";
import { FormInput } from "./FormInput";
import { ReactTreeView } from "./ReactTreeView";
import { JsonOutputView } from "./JsonOutputView";

export default function App() {
  var data = [
    {
      id: "0",
      text: "Question 0",
      nodes: []
    }
  ];

  let resetSelectedNodeData = (id) => {
    return {
      questionId: id,
      questionText: "",
      count: 0,
      weightage: 0,
      options: []
    };
  };

  let [treeData, setTreeData] = useState([
    {
      id: "0",
      text: "Question 0",
      nodes: []
    }
  ]);
  let [nodeData, setNodeData] = useState([]);
  let [selectedNodeData, setSelectedNodeData] = useState(
    resetSelectedNodeData("0")
  );

  let [jsonValue, setJsonValue] = useState([]);

  useEffect(() => {
    let selectNodeSession = sessionStorage.getItem("selectedNodeData");
    let treeDataSession = sessionStorage.getItem("treeData");
    let nodeDataSession = sessionStorage.getItem("nodeData");

    if (selectNodeSession) {
      setSelectedNodeData(JSON.parse(selectNodeSession));
    }
    if (treeDataSession) {
      setTreeData(JSON.parse(treeDataSession));
    }
    if (nodeDataSession) {
      setNodeData(JSON.parse(nodeDataSession));
    }
  }, []);

  useEffect(() => {
    console.log("update", selectedNodeData);
    sessionStorage.setItem(
      "selectedNodeData",
      JSON.stringify(selectedNodeData)
    );
  }, [selectedNodeData]);

  useEffect(() => {
    console.log("treeUpdate", treeData);
    sessionStorage.setItem("treeData", JSON.stringify(treeData));
  }, [treeData]);

  useEffect(() => {
    sessionStorage.setItem("nodeData", JSON.stringify(nodeData));
  }, [nodeData]);

  const updateTreeById = (id, tree, newId) => {
    if (tree == null) {
      return;
    }

    console.log(id, tree, newId);
    console.log(" tree update id: ", treeData);
    if (id == tree.id) {
      tree.nodes.push({
        id: newId,
        text: "Question " + newId,
        nodes: []
      });
      console.log("update id: ", treeData);
      setTreeData(treeData);

      sessionStorage.setItem("treeData", JSON.stringify(treeData));
    } else {
      updateTreeById(id, tree.nodes[0], newId);
      updateTreeById(id, tree.nodes[1], newId);
    }
  };

  const iterateTreeForJson = (parent, nodes) => {
    if (nodes == null) {
      return parent;
    }

    nodes.forEach((element) => {
      let nodeInfo = nodeData.find((ele) => {
        // console.log("hey: ", ele, element.id);
        return ele.questionId == element.id;
      });

      if (!nodeInfo) {
        if (element.id == selectedNodeData.questionId) {
          nodeInfo = selectedNodeData;
        } else {
          return parent;
        }
      }

      if (element.id.endsWith("0")) {
        parent.incorrect = {
          questionText: nodeInfo.questionText,
          weightage: nodeInfo.weightage,
          option: nodeInfo.options,
          redirectquestion: {}
        };

        return iterateTreeForJson(
          parent.incorrect.redirectquestion,
          element.nodes
        );
      } else if (element.id.endsWith("1")) {
        parent.correct = {
          questionText: nodeInfo.questionText,
          weightage: nodeInfo.weightage,
          option: nodeInfo.options,
          redirectquestion: {}
        };

        return iterateTreeForJson(
          parent.correct.redirectquestion,
          element.nodes
        );
      }
    });
  };

  const generateJson = () => {
    //   const newJson = { questionText: '',
    //   complexity: '',
    //   language: '',
    //   weightage: '',

    //   option: [{ text: 2, correct: true}, {text:3, correct: false}],
    //   redirectquestion: {
    //    correct: {
    //   AGAIN_QUESTION_OBJECT
    //   },
    //   incorrect: {
    //   AGAIN_QUESTION_OBJECT

    // };

    let newJson = {};
    if (nodeData.length == 0) {
      newJson = {
        questionText: selectedNodeData.questionText,
        weightage: selectedNodeData.weightage,
        option: selectedNodeData.options,
        redirectquestion: {}
      };
    } else {
      let node = nodeData.find((ele) => ele.questionId == 0);
      newJson = {
        questionText: node.questionText,
        weightage: node.weightage,
        option: node.options,
        redirectquestion: {}
      };
    }

    iterateTreeForJson(newJson.redirectquestion, treeData[0].nodes);

    console.log("hello" + newJson);
    setJsonValue(newJson);
  };

  return (
    <div>
      <ReactTreeView
        data={treeData}
        selectedNode={(id) => {
          if (nodeData.length === 0) {
            return;
          }
          if (
            !nodeData.find(
              (ele) => ele.questionId == selectedNodeData.questionId
            )
          ) {
            setNodeData([...nodeData, selectedNodeData]);
          }
          console.log(id, nodeData);
          let node = nodeData.find((ele) => ele.questionId == id);
          if (node) {
            console.log(node);
            setSelectedNodeData(node);
          }
        }}
      />
      <FormInput
        formData={{
          questionId: selectedNodeData.questionId,
          questionText: selectedNodeData.questionText,
          count: selectedNodeData.count,
          weightage: selectedNodeData.weightage,
          options: selectedNodeData.options
        }}
        updateQuestionText={(text) =>
          setSelectedNodeData({ ...selectedNodeData, questionText: text })
        }
        updateCount={(val) => {
          console.log(val);
          var freshArray = [];
          for (var i = 0; i < val; i++) {
            freshArray.push({ text: "", correct: false, id: i });
          }
          setSelectedNodeData({
            ...selectedNodeData,
            ...{ count: val, options: freshArray }
          });
        }}
        updateWeightage={(weight) =>
          setSelectedNodeData({ ...selectedNodeData, weightage: weight })
        }
        updateOptions={(options) =>
          setSelectedNodeData({ ...selectedNodeData, options: options })
        }
        correctNewFormClicked={() => {
          if (
            !nodeData.find(
              (ele) => ele.questionId == selectedNodeData.questionId
            )
          ) {
            setNodeData([...nodeData, selectedNodeData]);
          }
          const newId = selectedNodeData.questionId + ".1";
          const existingNode = nodeData.find((ele) => ele.questionId == newId);

          // console.log("Node exists: ", existingNode);

          if (existingNode) {
            setSelectedNodeData(existingNode);
            return;
          }
          const newNode = resetSelectedNodeData(
            selectedNodeData.questionId + ".1"
          );
          setSelectedNodeData(newNode);
          updateTreeById(selectedNodeData.questionId, treeData[0], newId);
        }}
        InCorrectNewFormClicked={() => {
          if (
            !nodeData.find(
              (ele) => ele.questionId == selectedNodeData.questionId
            )
          ) {
            setNodeData([...nodeData, selectedNodeData]);
          }
          // console.log("old:  " + selectedNodeData.questionId);
          const newId = selectedNodeData.questionId + ".0";

          const existingNode = nodeData.find((ele) => ele.questionId == newId);

          // console.log("Node exists: ", existingNode);

          if (existingNode) {
            setSelectedNodeData(existingNode);
            return;
          }

          const newNode = resetSelectedNodeData(newId);
          setSelectedNodeData(newNode);
          updateTreeById(selectedNodeData.questionId, treeData[0], newId);
        }}
      />
      <JsonOutputView jsonValue={jsonValue} generateJson={generateJson} />
    </div>
  );
}
