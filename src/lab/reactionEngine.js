/* =========================================================
   CHEMLAB VIRTUAL LAB 3
   REACTION ENGINE
========================================================= */


/* =========================================================
   HAS CHEMICAL
========================================================= */

function hasChemical(
  mixture,
  id
) {

  return (
    Number(
      mixture[id] || 0
    ) > 0
  )

}


/* =========================================================
   REACTANTS CHECK
========================================================= */

function hasReactants(
  reaction,
  mixture
) {

  return reaction
    .reactants
    .every(
      id =>
        hasChemical(
          mixture,
          id
        )
    )

}


/* =========================================================
   FORBIDDEN CHEMICALS
========================================================= */

function hasForbiddenChemical(
  reaction,
  mixture
) {

  if (
    !reaction.forbids
  ) {

    return false

  }


  return reaction
    .forbids
    .some(
      id =>
        hasChemical(
          mixture,
          id
        )
    )

}


/* =========================================================
   CONDITION CHECK
========================================================= */

function conditionsMatch(
  reaction,
  context
) {

  const conditions =
    reaction.conditions ||
    {}


  if (
    conditions.heating ===
      true &&
    !context.heating
  ) {

    return false

  }


  if (
    conditions.minTemperature !==
      undefined &&
    context.temperature <
      conditions.minTemperature
  ) {

    return false

  }


  if (
    conditions.maxTemperature !==
      undefined &&
    context.temperature >
      conditions.maxTemperature
  ) {

    return false

  }


  if (
    conditions.minPH !==
      undefined &&
    context.pH <
      conditions.minPH
  ) {

    return false

  }


  if (
    conditions.maxPH !==
      undefined &&
    context.pH >
      conditions.maxPH
  ) {

    return false

  }


  if (
    conditions.light ===
      true &&
    !context.lightOn
  ) {

    return false

  }


  if (
    conditions.catalyst
  ) {

    const catalysts =
      Array.isArray(
        conditions.catalyst
      )

        ? conditions.catalyst

        : [
            conditions.catalyst
          ]


    const hasCatalyst =
      catalysts.every(
        id =>
          hasChemical(
            context.mixture,
            id
          )
      )


    if (!hasCatalyst) {

      return false

    }

  }


  return true

}


/* =========================================================
   ORDER CHECK

   Ví dụ:

   order: [
     'cuso4',
     'naoh',
     'glucose'
   ]
========================================================= */

function additionOrderMatches(
  reaction,
  history
) {

  if (
    !reaction.order ||
    !reaction.order.length
  ) {

    return true

  }


  let lastIndex =
    -1


  for (
    const chemicalId
    of reaction.order
  ) {

    const index =
      history.indexOf(
        chemicalId
      )


    if (
      index === -1 ||
      index <=
        lastIndex
    ) {

      return false

    }


    lastIndex =
      index

  }


  return true

}


/* =========================================================
   CAN REACT
========================================================= */

export function canReactionRun(
  reaction,
  context
) {

  if (
    context.triggeredIds
      ?.has(
        reaction.id
      )
  ) {

    return false

  }


  if (
    !hasReactants(
      reaction,
      context.mixture
    )
  ) {

    return false

  }


  if (
    hasForbiddenChemical(
      reaction,
      context.mixture
    )
  ) {

    return false

  }


  if (
    !conditionsMatch(
      reaction,
      context
    )
  ) {

    return false

  }


  if (
    !additionOrderMatches(
      reaction,
      context.additionHistory ||
        []
    )
  ) {

    return false

  }


  return true

}


/* =========================================================
   FIND REACTIONS
========================================================= */

export function findAvailableReactions(
  reactions,
  context
) {

  return reactions
    .filter(
      reaction =>
        canReactionRun(
          reaction,
          context
        )
    )
    .sort(
      (
        a,
        b
      ) =>
        (
          b.priority ||
          0
        ) -
        (
          a.priority ||
          0
        )
    )

}