import React from "react";
import "./MatchingReport.css";
import "react-accessible-accordion/dist/fancy-example.css";

import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
} from "react-accessible-accordion";
import { useState, useEffect } from "react";
import Axios from "axios";
// import { search } from "../../../server/routes/routes";

const fetchpossales = (uswgp) => {
  console.log(uswgp);
};

const MatchingReport = ({
  posdata,
  matchingpossales,
  filteredPosList,
  setFilteredPosList,
}) => {
  // useEffect(() => {
  //   if (poslist) {
  //     Axios.post("/usinventoryupdates", { poslist });
  //   }
  // }, []);
  const [searchterm, setSearchterm] = useState();

  useEffect(() => {
    if (posdata) {
      if (searchterm && searchterm !== "") {
        const results = posdata.filter((item) => {
          if (searchterm && searchterm !== "") {
            return item.USWGP.includes(searchterm);
          }
        });
        setFilteredPosList(results);
      } else {
        setFilteredPosList(posdata);
      }
    }
  }, [searchterm]);

  return (
    <>
      <div className="matchreport">
        <label htmlFor="">Search:</label>
        <input
          className="matchsearch"
          value={searchterm}
          onChange={(e) => {
            setSearchterm(e.target.value);
          }}
        />
        {filteredPosList
          ? filteredPosList.map((item) => (
              <Accordion
                allowZeroExpanded={true}
                className="matchaccordion"
                onChange={(e) => {
                  fetchpossales(item.USWGP);
                }}
              >
                <AccordionItem>
                  <AccordionItemHeading>
                    <AccordionItemButton className="matchaccordion_button">
                      <ul>
                        <li>
                          <b>USWGP:</b> {item.USWGP}
                        </li>
                        <li>
                          <b>WGP:</b> {item.USpositionID}
                        </li>
                        <li className="prodli">
                          <b>Product:</b> {item.abbreviation}
                        </li>
                        <li>
                          <b>Quantity:</b> {item.quantity}mt
                        </li>
                        <li>
                          <b>Sold:</b> {item.totalSold}mt
                        </li>
                        <li>
                          <b>Unsold:</b> {item.inventory}mt
                        </li>
                      </ul>
                    </AccordionItemButton>
                  </AccordionItemHeading>
                  <AccordionItemPanel>
                    <ul className="matchpossales">
                      <li className="matchpossalesheader">
                        <p>USWGP</p>
                        <p>WGS</p>
                        <p>Customer</p>
                        <p className="matchfig">Quantity</p>
                      </li>
                      {matchingpossales
                        ? matchingpossales.map((x) =>
                            x.KTP === item.USWGP ? (
                              <li>
                                <p>{x.KTP}</p>
                                <p>{x.KTS}</p>
                                <p>{x.companyCode}</p>
                                <p className="matchfig">{x.quantity}</p>
                              </li>
                            ) : (
                              ""
                            )
                          )
                        : ""}
                    </ul>
                  </AccordionItemPanel>
                </AccordionItem>
              </Accordion>
            ))
          : ""}
      </div>
    </>
  );
};

export default MatchingReport;
