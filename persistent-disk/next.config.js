module.exports = {
  images: {
    domains: ["34.126.160.141"],
    loader: "imgix",
    path: "",
  },
  exportPathMap: function () {
    return {
      "/": { page: "/" },
    };
  },
};
