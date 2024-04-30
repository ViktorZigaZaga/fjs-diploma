// {images && images.length && 
//     Array(images).map((item, i) => 
//     <Figure  
//       key={i}
//       className="d-flex align-items-start m-3"
//     >
//       <Figure.Image
//         className="rounded"
//         width={750}
//         height={750}
//         alt={`${item[i].name}`}
//         src={item[i].name}
//       />
//       <CloseButton onClick={removeFile} style={{position: "relative", top: 5, right: 28, padding: 8 }} />
//     </Figure>
//   )}