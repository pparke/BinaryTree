/*
 * Lsystem
 * ============================================================================
 *
 *
 */


class Lsystem {
  constructor (game, ... args) {
    this.variables = ['0', '1'];

    this.axiom = '0';
    this.nextAxiom = this.axiom.split('');
    this.rules = {
      '0': '1-[[0]+0]+1[+10]-0        ',
      '1': '11'
    };

    this.axiomPosition = 0;
    this.nextPosition = 0;

  }

  /**
   * Step
   * Read the instruction at the current position and perform
   * the indicated action.
   */
  step () {
    let symbol = this.axiom.charAt(this.axiomPosition);
    // check if it is a rule
    if (this.rules[symbol]) {
      let rule = this.rules[symbol];
      this.nextAxiom.splice(this.nextPosition, 1, ...rule.split(''));
      this.nextPosition += rule.length - 1;
    }

    this.axiomPosition += 1;
    this.nextPosition += 1
    if (this.axiomPosition >= this.axiom.length) {
      this.axiom = this.nextAxiom.join('');
      this.axiomPosition = 0;
      this.nextPosition = 0;
    }
  }

  /**
   * Iterate
   * Perform one full iteration of the axiom replacing all
   * variables with their associated rules.
   */
  iterate () {
    for (let i = 0; i < this.axiom.length; i++) {
      this.step();
    }
  }

  /**
   * Set Rule
   */
  setRule (i, rule) {
    this.rules[i] = rule;
  }

}


export default Lsystem;
