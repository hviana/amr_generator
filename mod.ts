/*
Created by: Henrique Emanoel Viana
Github: https://github.com/hviana
Page: https://sites.google.com/view/henriqueviana
cel: +55 (41) 99999-4664
*/

import {
  AMRGraph,
  AMRUtils,
  and,
  anyo,
  eq,
  ImmutableMap,
  LVar,
  lvar,
  membero,
  not,
  or,
  walk,
} from "./deps.ts";

import GeneratorCore from "./generator_core.ts";

export { GeneratorCore };
export class AMRGenerator {
  async initWordnet(path: string = "./wordnet.data") {
    await GeneratorCore.initWordnet(path);
  }
  #core: GeneratorCore = new GeneratorCore();
  sayHi(): AMRGraph {
    const word = this.#core.randomSynonym("hi", "n");
    return this.#core.utils.createInstance(word);
  }
  sayNice() {
    const word = this.#core.randomSynonym("nice", "a");
    return this.#core.utils.createInstance(word + "-01"); //TODO '-01' is necessary?
  }
  sayKnow(): AMRGraph {
    const word = "know"; //not performs well on wordnet //this.#core.randomSynonym("know", "v");
    return this.#core.utils.createInstance(word + "-01"); //TODO '-01' is necessary?
  }
  sayOk(): AMRGraph {
    const word = this.#core.randomSynonym("ok", "s");
    return this.#core.utils.createInstance(word);
  }
  sayGoodbye(): AMRGraph {
    const word = this.#core.randomSynonym("goodbye", "n");
    return this.#core.utils.createInstance(word);
  }
  sayIdontKnow(): AMRGraph {
    var graph1: AMRGraph = {
      k: [[":instance", "know-01"], [":polarity", "-"], [":ARG0", "ii"]],
      ii: [[":instance", "i"]],
    };
    const graph2: AMRGraph = this.sayKnow();
    return (this.#core.utils.joinGraph(graph1, {
      mode: "replace",
      graph: graph2,
    }, ["k"])).graph;
  }

  introduceYourself(name: string = "Artificial intelligence"): AMRGraph {
    var graph1: AMRGraph = {
      n: [
        [":instance", "name-01"],
        [":ARG1", "ii"],
        [":ARG2", "p"],
        [":mod", "h"],
      ],
      ii: [[":instance", "i"]],
      p: [[":instance", "person"], [":name", "n2"]],
      n2: [[":instance", "name"]], //append node
      h: [[":instance", "hello"]], //replace node
    };
    const nameTokens = this.#core.utils.tokenizeName(name);
    this.#core.utils.appendListNode(nameTokens, graph1, "n2", ":op");
    const graph2: AMRGraph = this.sayHi();
    return (this.#core.utils.joinGraph(graph1, {
      mode: "replace",
      graph: graph2,
    }, ["h"])).graph;
  }
  sayNiceToMeetYou(name: string | AMRGraph = "Unknown Entity") {
    var graph1: AMRGraph = {
      s: [[":instance", "say-01"], [":ARG1", "n"], [":ARG2", "p"]],
      n: [[":instance", "nice-01"], [":ARG1", "m"]], //here nice (replace)
      m: [[":instance", "meet-02"], [":ARG0", "ii"], [":ARG1", "p"]],
      ii: [[":instance", "i"]],
      p: [[":instance", "person"], [":name", "n2"]],
      n2: [[":instance", "name"]], //here name (append or replace)
    };

    if (typeof name === "string") {
      const nameTokens = this.#core.utils.tokenizeName(name);
      this.#core.utils.appendListNode(nameTokens, graph1, "n2", ":op");
    } else {
      graph1 = this.#core.utils.joinGraph(graph1, {
        mode: "replace",
        graph: name,
      }, ["n2"]).graph;
    }
    const graph2: AMRGraph = this.sayNice();
    return (this.#core.utils.joinGraph(graph1, {
      mode: "replace",
      graph: graph2,
    }, ["n"])).graph;
  }
}
