const garageModel = require("../models/garages.model");
const userModel = require("../models/user.model");

exports.getAllGarages = async (req, res) => {
  try {
      const id = req.session.adminId;
      const data = await userModel.getAdminsData(id);

      const { garages, admin } = await garageModel.getGarages();

      res.render('addGarage', {
          garages,
          admin,
          pageTitle: "Dashboard - Garages",
          isAdmin: req.session.adminId,
          darkMode: data ? data.darkMode : false,
        });
  } catch (error) {
      console.error(error);
      res.redirect('/dashboardError');
  }
};

exports.getAddGarage = async (req, res) => {
  try {
      const id = req.session.adminId;
      const data = await userModel.getAdminsData(id);

      const { garages, admin } = await garageModel.getGarages();

      res.render('add', {
          admin,
          pageTitle: "Dashboard - Add New Garage",
          isAdmin: req.session.adminId,
          darkMode: data ? data.darkMode : false,
        });
  } catch (error) {
      console.error(error);
      res.redirect('/dashboardError');
  }
};

exports.postGarage = async (req, res) => {
  const { garageName, garageAddress, garageNumSlots, garageDetails } = req.body;

  try {
    await garageModel.createNewGarages(garageName, garageAddress, garageNumSlots, garageDetails);
    req.flash("info", "New garage has been added.");
    res.redirect("/addGarage");
  } catch (error) {
    console.log(error);
  }
};

exports.postEdit = async (req, res) => {
  try {
    await garageModel.Garages.findOneAndUpdate({ _id: req.params.id }, {
      garageName: req.body.garageName,
      garageAddress: req.body.garageAddress,
      garageNumSlots: req.body.garageNumSlots,
      garageSlots: Array.from({ length: req.body.garageNumSlots }, (_, i) => ({
        slotNumber: i + 1,
        isOccupied: false,
        occupiedBy: null,
      })),
      garageDetails: req.body.garageDetails,
      updatedAt: Date.now()
    });
    res.redirect('/addGarage'); 
  } catch (error) {
    console.error(error);
    res.redirect('/dashboardError');
}
};

exports.deleteGarage = async (req, res) => {
  try {
    await garageModel.Garages.findByIdAndDelete(req.params.id); 
    res.redirect("/addGarage");
  } catch (error) {
    console.error(error);
    res.redirect('/dashboardError');
  }
};