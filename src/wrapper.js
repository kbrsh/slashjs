(function(root, factory) {
  /* ======= Global Slash ======= */
  (typeof module === "object" && module.exports) ? module.exports = factory() : root.Slash = factory();
}(this, function() {
    //=require ../dist/slash.js
    return Slash;
}));
