describe('math', function() {
  describe('addition', function() {
    it('should add two numbers', function() {
      expect(1 + 1).toBe(2);
      expect(2 + 2).toBe(4);
    });
  });

  describe('multiplication', function() {
    it('should multiply two numbers', function() {
      expect(3 * 3).toBe(9);
      expect(4 * 4).toBe(16);
    });
  });
});
