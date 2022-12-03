
class FullSet<T> {
  elements: Set<T>;
  constructor(...elements: Array<T>) {
    this.elements = new Set()
    this.add(...elements);
  }

  add(...elements: Array<T>) {
    for(let element of elements) {
      this.elements.add(element);
    }
  }

  clone() {
    let result = new FullSet();
    result.add(...this.elements.values());
    return result;
  }

  contains(element: T) {
    return this.elements.has(element);
  }

  equal(other_set: FullSet<T>) {
    if(this.size() === other_set.size()) {
      let result = true;
      for(let element of this.elements) {
        result = result && other_set.contains(element);
      }
      return result;
    }
    return false
  }

  remove(...elements: Array<T>) {
    for(let i = 0; i < elements.length; i++) {
         this.elements.delete(elements[i]);
    }
  }

  values() {
    return this.elements.values();
  }

  *[Symbol.iterator]() {
    yield * this.elements;
  }

  union(other_set: FullSet<T>) {
    let result = other_set.clone();
    result.add(...this.elements);
    return result;
  }

  intersect(other_set: FullSet<T>): FullSet<T> {
    let result = new FullSet<T>();
    for(let element of this.elements) {
      if(other_set.contains(element)) {
        result.add(element);
      }
    }
    return result;
  }

  complement(universe: FullSet<T>) {
    let result = universe.clone();
    result.remove(...this.elements);
    return result;
  }

  relativeComplement(other_set: FullSet<T>) {
    let result = other_set.complement(this);
    return result;
  }

  symmetricDifference(other_set: FullSet<T>) {
    let result = this.union(other_set).relativeComplement(this.intersect(other_set));
    return result;
  }

  crossProduct(other_set: FullSet<T>) {
    let result = new FullSet();
    for(let elementA of this.elements) {
        for(let elementB of other_set.elements) {
            result.add([elementA, elementB]);
        }
    }
    return result;
  }

  *powerSetIter() {

    function increment(bool_array: boolean[]) {
        for(let i = 0; i < bool_array.length; i++) {
            if(!bool_array[i]) {
                bool_array[i] = true;
                return;
            }else{
                bool_array[i] = false;
            }
        }
    }
    let count = [];
    let elements = Array.from(this.elements);


    for(let i = 0; i < elements.length; i++) {
        count[i] = false;
    }
    for(let i=0; i < Math.pow(2, elements.length); i++) {
        let choices = new FullSet();
        for(let k = 0; k < elements.length; k++) {
            if(count[k]) {
                choices.add(elements[k]);
            }
        }
        yield choices;
        increment(count);
    }
  }

  powerSet() {
    return new FullSet(...this.powerSetIter())
  }

  cardinality() {
    return this.elements.size;
  }
  
  size() {
    return this.elements.size;
  }
}

export default FullSet;
