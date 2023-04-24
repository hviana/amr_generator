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
  conso,
  eq,
  ImmutableMap,
  LVar,
  lvar,
  membero,
  not,
  or,
  QueryCore,
  run,
  succeed,
  walk,
  WordClass,
} from "./deps.ts";

export default class GeneratorCore {
  #utils: AMRUtils = new AMRUtils();
  static async initWordnet(path: string = "./wordnet.data") {
    await QueryCore.initWordnet(path);
  }
  get utils() {
    return this.#utils;
  }
  synonyms(lemma: string, wordClass: WordClass): string[] {
    return QueryCore.runY((y: any) => {
      const synset = lvar();
      return and(
        () => QueryCore.wordNet.lemmas(synset, lemma),
        () => QueryCore.wordNet.pos(synset, wordClass),
        () => QueryCore.wordNet.lemmas(synset, y),
      );
    });
  }
  randomSynonym(lemma: string, wordClass: WordClass): string {
    const synonyms = this.synonyms(lemma, wordClass);
    return synonyms[Math.floor(Math.random() * synonyms.length)];
  }
  randomChangeInstances(graph: AMRGraph) {
  }
}
